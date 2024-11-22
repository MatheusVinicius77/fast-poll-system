from collections import defaultdict
from typing import Optional
import boto3
from boto3.dynamodb.conditions import Key
from dotenv import load_dotenv
import os

load_dotenv()
aws_access_key = os.getenv("AWS_ACCESS_KEY_ID")
aws_secret_key = os.getenv("AWS_SECRET_ACCESS_KEY")
region_name = os.getenv("REGION_NAME")
class DynamoDBController:

    def __init__(self):
        dynamodb = boto3.resource(
            'dynamodb',
            aws_access_key_id=aws_access_key,
            aws_secret_access_key=aws_secret_key,
            region_name=region_name,
        )
        
        self.table = dynamodb.Table('poll')

    def create_item(self, item):
        """
        Process the poll and create individual items for each option.
        
        :param item: The poll object containing PollID, Title, and Options.
        :return: Response for each created option.
        """
        try:
            poll_id = item["PollID"]
            title = item["Title"]
            options = item["Options"]

            responses = []
            for option in options:
                option_item = {
                    "PollID": poll_id,
                    "OptionID": option["OptionID"],
                    "OptionText": option["OptionText"],
                    "Title": title,
                }
                response = self.table.put_item(Item=option_item)
                responses.append(response)

            return {"status": "success", "responses": responses}
        except Exception as e:
            print("Error creating items:", str(e))
            return {"status": "error", "message": str(e)}

    def get_all_items(self, poll_id: Optional[int] = None):
        """
        Get all items from the table, or filter by the given partition key (PollID),
        and group them by PollID.
        
        :param poll_id: (Optional) The value of the partition key to filter by.
        :return: A list of grouped items with all options for each PollID.
        """
        try:
            if poll_id is not None:
                response = self.table.query(
                    KeyConditionExpression=boto3.dynamodb.conditions.Key('PollID').eq(poll_id)
                )
            else:
                response = self.table.scan()

            items = response.get('Items', [])
            
            # Grouping items by PollID
            grouped_items = defaultdict(lambda: {"PollID": None, "Title": None, "Options": []})
            for item in items:
                poll_id = item["PollID"]
                grouped_items[poll_id]["PollID"] = poll_id
                grouped_items[poll_id]["Title"] = item.get("Title", "Título não disponível")
                grouped_items[poll_id]["Options"].append({
                    "OptionID": item["OptionID"],
                "OptionText": item["OptionText"],
                "Votes": item.get("Votes", 0)  # Inclui o campo Votes (padrão 0)

                })

            # Convert grouped items to a list
            return list(grouped_items.values())
        except Exception as e:
            print("Erro ao buscar os itens:", str(e))
            return []
        
    def get_specific_item(self, poll_id, option_id):
        """
        Get all items with the same partition key.
        
        :param partition_key_value: The value of the partition key.
        :return: A list of items with the specified partition key.
        """
        poll_id = int(poll_id)
        option_id = int(option_id)
        try:
            response = self.table.query(
                KeyConditionExpression=Key('PollID').eq(poll_id) & Key('OptionID').eq(option_id)
            )
            return response.get('Items', [])
        except Exception as e:
            print("Erro ao buscar os itens:", str(e))
            return []

    def vote_option(self, poll_id: int, option_id: int):
        """
        Increment the vote count for a specific option in a poll.
        
        :param poll_id: The PollID of the poll.
        :param option_id: The OptionID of the option being voted on.
        :return: The updated item or an error message.
        """
        try:
            response = self.table.update_item(
                Key={
                    'PollID': poll_id,
                    'OptionID': option_id
                },
                UpdateExpression="SET Votes = if_not_exists(Votes, :start) + :inc",
                ExpressionAttributeValues={
                    ':start': 0,
                    ':inc': 1
                },
                ReturnValues="UPDATED_NEW"
            )
            return response
        except Exception as e:
            print("Erro ao registrar o voto:", str(e))
            return {"error": str(e)}