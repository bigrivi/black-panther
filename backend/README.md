# BlackPanther - Backend

## Technology Stack
- ⚡ [**FastAPI**](https://fastapi.tiangolo.com) for the Python API.
- ✒️ [BetterCRUD](https://github.com/bigrivi/better_crud) Quickly implement CRUD functions
- 🧰 [SQLModel](https://sqlmodel.tiangolo.com) for the Python SQL database interactions (ORM).
- 🔍 [Pydantic](https://docs.pydantic.dev), used by FastAPI, for the data validation and settings management.

## Project Advantages
- 🎤 Fully Async: Leverages Python's async capabilities for non-blocking database operations.
- 🎷 Scalable project directory structure
- 👜 Module pluggable

## Requirements
- **Python:** Version 3.9 or newer.
- **Redis server**
- **Database**:Mysql,Of course, you can also use any of your own databases that are supported by SQLAlchemy

## Getting Started

1. Install dependencies
```bash
pip install -r requirements.txt.
```

2. 📁 **data.sql** provides some basic use case data, please restore it to your database first

3. Modify the configuration of environment variables in the **.env** file,For more information, see app/config/settings.py

4. Start the development server
```bash
fastapi dev --port 8081
```

## Deployment
For details, see Deploying [FastAPI](https://fastapi.tiangolo.com/deployment/)

## License

MIT
