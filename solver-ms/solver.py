import os
import pika
import json
import subprocess
import tempfile

def solve_problem(ch, method, properties, body):
    try:
        problem_data = json.loads(body)
        input_file_content = problem_data['input_file']
        param1 = str(problem_data['param1'])
        param2 = str(problem_data['param2'])
        param3 = str(problem_data['param3'])

        # Create a temporary file to save the input JSON content
        with tempfile.NamedTemporaryFile(mode='w+', delete=False, suffix='.json') as temp_file:
            temp_file.write(input_file_content)
            temp_file_path = temp_file.name

        # Call the vrpSolver.py script
        result = subprocess.run(['python', 'vrpSolver.py', temp_file_path, param1, param2, param3], capture_output=True)
        print(" [x] Result: %s" % result.stdout)

        # Clean up the temporary file
        os.remove(temp_file_path)

        ch.basic_ack(delivery_tag=method.delivery_tag)
    except KeyError as e:
        print(f"KeyError: Missing key {e} in message {body}")
        ch.basic_ack(delivery_tag=method.delivery_tag)
    except Exception as e:
        print(f"Error processing message: {e}")
        ch.basic_ack(delivery_tag=method.delivery_tag)

credentials = pika.PlainCredentials('user', 'password')
connection = pika.BlockingConnection(pika.ConnectionParameters('rabbitmq', 5672, '/', credentials))
channel = connection.channel()

channel.queue_declare(queue='problem_queue')

channel.basic_consume(queue='problem_queue', on_message_callback=solve_problem)

print(' [*] Waiting for messages. To exit press CTRL+C')
channel.start_consuming()