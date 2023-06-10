import sys, json

# Read data from stdin
def read_in():
    lines = sys.stdin.readlines()
    return json.loads(lines[0])

def main():
    #get our data as an array from read_in()
    data = read_in()

    # Get the code, test cases and function name
    code = data['code']
    test_cases = data['testCases']
    function_name = data['functionName']

    # Create a dictionary for local variables
    local_vars = {}

    # Execute the code
    exec(code, globals(), local_vars)

    # Extract the user-defined function if it exists
    function = local_vars.get(function_name)

    if function is None:
        print(json.dumps({"output": f"Function '{function_name}' not found"}))
        return

    # Test each case
    for i, test_case in enumerate(test_cases):
        # get input and expected output from the test case
        test_input = test_case['input']
        expected_output = test_case['expectedOutput']

        try:
            result = function(test_input)
        except Exception as e:
            print(json.dumps({"output": f"An error occurred while executing the function: {str(e)}"}))
            return

        # Check if the result is correct
        if result == expected_output:
            print(json.dumps({"output": f"Test case {i+1} passed!"}))
        else:
            print(json.dumps({"output": f"Test case {i+1} failed. Expected {expected_output}, but got {result}."}))

# Start process
if __name__ == '__main__':
    main()
