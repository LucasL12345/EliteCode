import sys, json

# Read data from stdin
def read_in():
    lines = sys.stdin.readlines()
    return json.loads(lines[0])

def main():
    #get our data as an array from read_in()
    data = read_in()

    # Prepare the code to be executed
    code = data['code']

    # Execute the code
    exec(code)

# Start process
if __name__ == '__main__':
    main()
