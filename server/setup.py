from setuptools import find_packages, setup

setup(
    name="recoord",
    packages=find_packages(),
    include_package_data=True,
    install_requires=[
        "Django",
        "flask",
        "appdirs==1.4.3",
        "astroid==2.3.0",
        "attrs==19.1.0",
        "black==19.3b0",
        "Click==7.0",
        "cycler==0.10.0",
        "ffmpeg-python==0.2.0",
        "Flask==1.1.1",
        "future==0.17.1",
        "isort==4.3.21",
        "itsdangerous==1.1.0",
        "Jinja2==2.10.1",
        "kiwisolver==1.1.0",
        "lazy-object-proxy==1.4.2",
        "MarkupSafe==1.1.1",
        "matplotlib==3.1.1",
        "mccabe==0.6.1",
        "numpy==1.17.2",
        "pylint==2.4.0",
        "pyparsing==2.4.2",
        "python-dateutil==2.8.0",
        "scipy==1.3.1",
        "six==1.12.0",
        "toml==0.10.0",
        "typed-ast==1.4.0",
        "Werkzeug==0.16.0",
        "wrapt==1.11.2",
        "youtube-dl==2019.11.28",
    ],
)
