from flask import Blueprint, request, jsonify
from src.constants.http_status_codes import  HTTP_200_OK, HTTP_201_CREATED, HTTP_409_CONFLICT, HTTP_204_NO_CONTENT, HTTP_404_NOT_FOUND, HTTP_400_BAD_REQUEST
from src.database import db, Task
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy import desc
from datetime import datetime

tasks = Blueprint("tasks", __name__, url_prefix="/tasks")


@tasks.post("/add")
@jwt_required()
def add_task():
    current_user_id=get_jwt_identity()

    if request.method == "POST":
        title = request.get_json().get('title')
        description = request.get_json().get('description')
        reminder_time = request.get_json().get('reminder_time')

        # check if the title and description is not empty
        if title is None or description is None or reminder_time is None:
            return jsonify({"error": 'title or description cannot be null'})
        
        # add task to the database
        task=Task(title=title, description=description, reminder_time=datetime.fromisoformat(reminder_time), user_id=current_user_id, is_completed=False)
        db.session.add(task)
        db.session.commit()

        return jsonify({
            'id': task.id,
            'title': task.title,
            'description': task.description,
            'reminder_time': task.reminder_time,
            'is_completed': task.is_completed,
            'created_at': task.create_at,
            'updated_at': task.updated_at
        }), HTTP_201_CREATED

# get all todo
@tasks.get('/all')
@jwt_required()
def all_tasks():
    current_user_id=get_jwt_identity()
    # implement pagination
    page=request.args.get('page', 1, type=int)
    per_page=request.args.get('per_page', 6, type=int)

    #  using the GET request to retrieve ta
    tasks=Task.query.filter_by(user_id=current_user_id).order_by(Task.create_at.desc()).paginate(page=page, per_page=per_page)
    data = []

    if tasks:

        for task in tasks.items:
            data.append(
                {
                    'id': task.id,
                    'title': task.title,
                    'description': task.description,
                    'reminder_time': task.reminder_time,
                    'is_completed': task.is_completed,
                    'created_at': task.create_at,
                    'updated_at': task.updated_at
                    }
                )
            metadata={
                'page': tasks.page,
                'per_page':tasks.per_page,
                'has_next': tasks.has_next,
                'has_prev': tasks.has_prev,
                'total': tasks.total,
                'next_page': tasks.next_num,
                'prev_page': tasks.prev_num
            }
        return jsonify({'data': data, 'metadata': metadata}), HTTP_200_OK
    return jsonify({"message": "You do not have any tasks."})

# get a single todo
@tasks.get('/<int:id>')
@jwt_required()
def get_task(id):
    current_user_id=get_jwt_identity()

    #  using the GET request to retrieve todos
    task=Task.query.filter_by(id=id, user_id=current_user_id).first()
    if task:
        return jsonify(
            {
            'id': task.id,
            'title': task.title,
            'description': task.description,
            'reminder_time': task.reminder_time,
            'is_completed': task.is_completed,
            'created_at': task.create_at,
            'updated_at': task.updated_at
            }
        ), HTTP_200_OK
    else:
        return jsonify({'error': f'{HTTP_404_NOT_FOUND} File not found'}), HTTP_404_NOT_FOUND

# delete task
@tasks.delete('delete/<int:id>')
@jwt_required()
def delete_task(id):
    current_user_id=get_jwt_identity()

    task=Task.query.filter_by(id=id, user_id=current_user_id).first()
    
    if not task:
        return jsonify({'error': f'{HTTP_404_NOT_FOUND} File not found'}), HTTP_404_NOT_FOUND
    
    db.session.delete(task)
    db.session.commit()
    return jsonify({'message': 'Task deleted!'}), HTTP_204_NO_CONTENT
        
# update route
@tasks.put("/update/<int:id>")
@tasks.patch("/update/<int:id>")
@jwt_required()
def update_task(id):
    current_user_id=get_jwt_identity()

    task=Task.query.filter_by(id=id, user_id=current_user_id).first()
    
    if task:
        title = request.get_json().get('title')
        description = request.get_json().get('description')
        reminder_time = request.get_json().get('reminder_time')
        is_completed = request.get_json().get('is_completed')

        if title is None or description is None or reminder_time is None:
            return jsonify({"error": 'title or description cannot be null'})
        
        task.title = title
        task.description = description
        task.reminder_time = datetime.fromisoformat(reminder_time)
        task.is_completed = is_completed
        db.session.commit()

        return jsonify({
            'id': task.id,
            'title': task.title,
            'description': task.description,
            'reminder_time': task.reminder_time,
            'is_completed': task.is_completed,
            'created_at': task.create_at,
            'updated_at': task.updated_at
        }), HTTP_201_CREATED
    else:
        return jsonify({'error': f'{HTTP_400_BAD_REQUEST,} Bad request'}), HTTP_400_BAD_REQUEST,





