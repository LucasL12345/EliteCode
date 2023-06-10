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

    # Create a dictionary for local variables
    local_vars = {}

    # Execute the code
    exec(code, globals(), local_vars)

    # Define the test cases
    test_cases = [
        {"input": [4,2,3,5,1], "expected": [1,2,3,4,5]},
        {"input": [1], "expected": [1]},
    ]

    # Extract the user-defined function if it exists
    sort_function = local_vars.get('sort_list')

    if sort_function is None:
        print(json.dumps({"output": "Function 'sort_list' not found"}))
        return

    # Test each case
    for i, test_case in enumerate(test_cases):
        try:
            result = sort_function(test_case["input"])
        except Exception as e:
            print(json.dumps({"output": f"An error occurred while executing the function: {str(e)}"}))
            return

        # Check if the result is correct
        if result == test_case["expected"]:
            print(json.dumps({"output": f"Test case {i+1} passed!"}))
        else:
            print(json.dumps({"output": f"Test case {i+1} failed. Expected {test_case['expected']}, but got {result}."}))

# Start process
if __name__ == '__main__':
    main()
