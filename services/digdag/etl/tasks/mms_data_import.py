from models.pod import POD


def run_job():
    pod = POD(pod_name='digdag-mms-job', env_pod='mds-python-backend', command=["flask", "run-etl"])
    pod.create_pod()
    print("Job finished")
