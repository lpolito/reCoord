from flask import Flask

from align import align_routes

app = Flask(__name__, instance_relative_config=False)
app.config.from_object("default_config")
app.register_blueprint(align_routes.align_bp)
