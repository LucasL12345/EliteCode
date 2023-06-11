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

    # Declare the response variable
    response = []

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
            response.append({"output": f"An error occurred while executing the function: {str(e)}", "status": "error"})
            continue

        # Check if the result is correct
        if result == expected_output:
            response.append({"output": f"Test case {i+1} passed!", "input": test_input, "expectedOutput": expected_output, "actualOutput": result, "status": "passed"})
        else:
            response.append({"output": f"Test case {i+1} failed. Expected {expected_output}, but got {result}.", "input": test_input, "expectedOutput": expected_output, "actualOutput": result, "status": "failed"})

    # Return the response
    print(json.dumps({"output": response, "status": all(test['status'] == 'passed' for test in response)}))


# Start process
if __name__ == '__main__':
    main()
