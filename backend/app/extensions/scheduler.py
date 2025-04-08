from typing import List, Dict, Callable, Any
from apscheduler.schedulers.asyncio import AsyncIOScheduler


class AsyncIOSchedulerService:
    registered_jobs: List[Dict[str, Any]] = []
    start_tasks: List[Callable] = []

    async def start(self):
        self.scheduler = AsyncIOScheduler()
        self.scheduler.start()
        for job in self.registered_jobs:
            self.scheduler.add_job(
                job.get("func"),
                job.get("trigger"),
                id=job.get("id"),
                **job.get("kwargs")
            )
        for task in self.start_tasks:
            await task()

    def scheduled_job(self, trigger: str, job_id: str, **kwargs):
        def decorator(func):
            self.registered_jobs.append(
                {"id": job_id, "func": func, "trigger": trigger, "kwargs": kwargs}
            )
        return decorator

    def add_start_task(self):
        def decorator(func):
            self.start_tasks.append(func)
        return decorator


scheduler_service = AsyncIOSchedulerService()
