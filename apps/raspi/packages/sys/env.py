from dotenv import load_dotenv

DOTENV_LOADED: bool = False

def init_env():
    global DOTENV_LOADED
    if DOTENV_LOADED:
        return

    load_dotenv()

    DOTENV_LOADED = True
