function deleteConfirmation() {

    // Displaying a confirmation dialog box

    var confirmed = confirm("Are you sure you want to delete this book?");

    // If the user clicks OK, submit the DELETE request to the server

    if (confirmed) {

        // Submit the DELETE request to the server


    } else {

        // Cancel the delete operation


    }



}