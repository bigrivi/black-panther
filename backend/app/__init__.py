import importlib
import os


def install_router_module():
    for name in os.listdir("app/modules"):
        if name.endswith(".py"):
            continue
        router_module_path = f"app.modules.{name}.router"
        spec = importlib.util.find_spec(router_module_path)
        if spec is not None:
            importlib.import_module(router_module_path)
