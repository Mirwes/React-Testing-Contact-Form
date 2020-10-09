import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';
import ContactForm from './ContactForm';

test('Contact form renders without crashing', () => {
    render(<ContactForm />);
});

test('Contains input for first name', () => {
    const { getByPlaceholderText } = render(<ContactForm />);
    getByPlaceholderText('Enter Your First Name');
});

test('Contains input for last name', () => {
    const { getByPlaceholderText } = render(<ContactForm />);
    getByPlaceholderText('Enter Your Last Name');
});

test('Contains input for email', () => {
    const { getByPlaceholderText } = render(<ContactForm />);
    getByPlaceholderText('Enter Your Email Here');
});

test('Contains textarea for a message', () => {
    const { getByPlaceholderText } = render(<ContactForm />);
    getByPlaceholderText('Write a message...');
});

test('Form records and submits information correctly', async () => {
    const { getByPlaceholderText, getByRole, getByTestId } = render(<ContactForm />);
    //get inputs
    const firstInput = getByPlaceholderText('Enter Your First Name');
    const secondInput = getByPlaceholderText('Enter Your Last Name');
    const emailInput = getByPlaceholderText('Enter Your Email Here');
    const messageTextArea = getByPlaceholderText('Write a message');
    const submitButton = getByRole('button');

    //make values

    const firstName = 'Mirwes';
    const lastName = 'Hakimi';
    const email = 'm@gmail.com';
    const message = 'Here is a test message.';

    //type values into inputs
    await act( async () => {
        await userEvent.type(firstInput, firstName);
        await userEvent.type(secondInput, lastName);
        await userEvent.type(emailInput, email); 
        await userEvent.type(messageTextArea, message);
        submitButton.click();
    } );
    
    // data will be displayed, so get pre element that displays data
    const displayedData = getByTestId(/^data-json-stringified$/);

    //make sure displayed data matches whate was input.

    const expected = `{
        "firstName": "${firstName}",
        "lastName": "${lastName}",
        "email": "${email}",
        "message": "${message}"
    }`;

    expect(displayedData.textContent).toBe(expected);

});
test('Required fields display error after touched if no text was entered', async () => {
    const { findAllByText, getByRole } = render(<ContactForm />);
    
    const submitButton = getByRole('button');

    //Clicking the submit button will cause all empty
    //Required inputs to displa an error.
    submitButton.click();

    //errors should display now
    const errors = await findAllByText('Looks like there was an error: required');

    //If all errors displayed correctly, there should be 3.
    expect(errors.length).toBe(3);
});

test('First name input throws error if a name under 3 characters is typed', async () => {
    const { getByRole, getByPlaceholderText, findByText } = render(<ContactForm />);
    
    const firstInput = getByPlaceholderText('Enter Your First Name');
    const submitButton = getByRole('button');

    await act(async () => {
        await userEvent.type(firstInput, "vi");
        submitButton.click();
    })
    await findByText('Looks like there was an error: minLength');
});