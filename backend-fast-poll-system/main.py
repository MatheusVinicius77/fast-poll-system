from typing import Optional, Union
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, Query
from pydantic import BaseModel
from dynamodb_controller import DynamoDBController

app = FastAPI()


origins = [
    "http://localhost",
    "http://localhost:8080",
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class VoteRequest(BaseModel):
    poll_id: int
    option_id: int

@app.post("/vote/")
def vote(vote_request: VoteRequest):
    """
    Endpoint to cast a vote for a specific option in a poll.
    
    :param vote_request: The poll ID and option ID.
    :return: The updated vote count or an error message.
    """
    dynamo_controller = DynamoDBController()
    return dynamo_controller.vote_option(vote_request.poll_id, vote_request.option_id)

@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.post("/put-item/")
def read_item(item: dict):
    print(f"\nitem\n")
    dynamo_controller = DynamoDBController()
    return dynamo_controller.create_item(item)

@app.get("/get-all/")
def read_all(poll_id: Optional[int] = Query(None)):
    dynamo_controller = DynamoDBController()
    return dynamo_controller.get_all_items(poll_id)

@app.get("/get-by-both-key/")
def read_item(poll_id, option_id):
    dynamo_controller = DynamoDBController()
    return dynamo_controller.get_specific_item(poll_id, option_id)


