<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
require("./config.php"); // if the file doesn't exist, stop program processing

// check if the request method is POST
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if (isset($_SERVER["PATH_INFO"])) {
        // If a user is logged in, check for session timeout and redirect to the login page if inactive
        if (isset($_POST["sid"])) {
            session_id($_POST["sid"]);
            session_start();
            // Check if the last activity time is set
            if (isset($_SESSION["last_activity"]) && $_SESSION["last_activity"] > time()) {
                // Update the last activity timestamp
                $_SESSION["last_activity"] = time() + 600;
            } else { // the session expires if more than 10 minutes have passed
                session_unset();
                session_destroy();
            }
        }

        switch ($_SERVER["PATH_INFO"]) {
            case "/login":
                $loginUser = null;
                $dbCon = new mysqli($dbServer, $dbUser, $dbPass, $dbName);
                if ($dbCon->connect_error) {
                    echo json_encode(["message" => "DB connection error. " . $dbCon->connect_error]);
                    $dbCon->close();
                } else {
                    // Query to check if the entered email match a record in the database
                    $result = $dbCon->query("SELECT * FROM user_tb WHERE email='" . $_POST["email"] . "'");
                    // Fetch the result as an associative array
                    $user = $result->fetch_array();
                    if ($user > 0) { // if the user data exist on the database
                        // check if the user data is in the black list
                        $resultBlk = $dbCon->query("SELECT * FROM blacklist_tb WHERE uid = " . $user["uid"]);
                        if ($resultBlk->num_rows > 0) { // if the user data exists in the black list, the user can't login.
                            $loginUser = 0;
                            echo json_encode(["message" => "Account is locked due to too many unsuccessful login attempts."]);
                        } else {
                            // Verify the enterd password and the hashed password on the user table
                            if (password_verify($_POST["pass"], $user["pass"])) {
                                if ($user["ecount"] != 5) {
                                    // Password is correct, reset login attempts
                                    $dbCon->query("UPDATE user_tb SET ecount = 5 WHERE uid=" . $user["uid"]);
                                }
                                // Set session variables for logged in user, and set timestamp for the last activity (login time)
                                session_start();
                                $_SESSION["loginUser"] = $user;
                                $_SESSION["last_activity"] = time() + 600;
                            } else {
                                $user["ecount"]--; // reduce the error count of password
                                if ($user["ecount"] <= 0) { //Lock the user account after unsuccessful authentication attempts passes 5 times.
                                    $dbCon->query("INSERT INTO blacklist_tb (uid) VALUES (" . $user["uid"] . ")");
                                }
                                // update the ecount on the user table 
                                $dbCon->query("UPDATE user_tb SET ecount=" . $user["ecount"] . " WHERE uid=" . $user["uid"]);
                            }
                        }
                    }
                }
                if (session_status() === 2) { // if session works, return the user type and session id to the front-end
                    $userData = ["fname" => $_SESSION["loginUser"]["fname"], "lname" => $_SESSION["loginUser"]["lname"]];
                    $response = ["user" => $userData, "sid" => session_id()];
                    echo json_encode($response);
                } else if ($loginUser === null) { // if the email/password/type is wrong.
                    echo json_encode(["message" => "email/password is wrong."]);
                }
                $dbCon->close();
                break;

            case "/logout":
                if (isset($_SESSION["loginUser"])) { // if the user is logged in, stop session
                    session_unset();
                    session_destroy();
                    echo json_encode(["message" => "Log out"]);
                } else {
                    echo json_encode(["logout" => "Login first."]);
                }
                break;

                // register user data
            case "/register":
                $dbCon = new mysqli($dbServer, $dbUser, $dbPass, $dbName);
                if ($dbCon->connect_error) {
                    echo json_encode(["message" => "DB connection error. " . $dbCon->connect_error]);
                    $dbCon->close();
                } else {
                    // Check if the email already exists in the appropriate table
                    $checkEmailQuery = "SELECT email FROM user_tb WHERE email = '" . $_POST["email"] . "'";
                    $result = $dbCon->query($checkEmailQuery);
                    if ($result->num_rows > 0) {
                        // Email already exists
                        echo json_encode(["message" => "Email already exists. Please choose a different email."]);
                    } else { // If the email doesn't exist, proceed with registration
                        // Insert user data into the appropriate table
                        $insertQuery = "INSERT INTO user_tb (fname, lname, email, pass) VALUES (?, ?, ?, ?)";
                        $stmtInsert = $dbCon->prepare($insertQuery);
                        // hash password
                        $pass = password_hash($_POST["pass"], PASSWORD_BCRYPT, ["cost" => 10]);
                        $stmtInsert->bind_param("ssss", $_POST["fname"], $_POST["lname"], $_POST["email"], $pass);

                        if ($stmtInsert->execute()) {
                            // Registration successful
                            echo json_encode(["success" => "Registration successful!"]);
                        } else {
                            echo json_encode(["message" => "Error"]);
                        }

                        $stmtInsert->close();
                        $dbCon->close();
                    }
                }
                break;

                // change password
            case "/change":
                if (isset($_SESSION["loginUser"])) { //check if the user login 
                    $dbCon = new mysqli($dbServer, $dbUser, $dbPass, $dbName);
                    if ($dbCon->connect_error) {
                        echo json_encode(["message" => "DB connection error. " . $dbCon->connect_error]);
                        $dbCon->close();
                    } else {
                        if ($_POST["email"] != $_SESSION["loginUser"]["email"]) { // if the sent email address doesn't match the lgin user email, can't change the password
                            echo json_encode(["message" => "email/password is wrong."]);
                        } else if (!(password_verify($_POST["pass"], $_SESSION["loginUser"]["pass"]))) { // if the sent password doesn't match the lgin user password, can't change the password
                            echo json_encode(["message" => "email/password is wrong."]);
                        } else {
                            $newPass = password_hash($_POST["newPass"], PASSWORD_BCRYPT, ["cost" => 10]);
                            $updatePass = "UPDATE user_tb SET pass = '" . $newPass . "' WHERE uid = " . $_SESSION["loginUser"]["uid"];
                            $dbCon->query($updatePass);
                            echo json_encode(["message" => "Your password is updated successfully!"]);
                            $dbCon->close();
                            $_SESSION["loginUser"]["pass"] = $newPass; // change the login user password
                        }
                    }
                } else {
                    echo json_encode(["logout" => "Login first."]);
                }
                break;

                //delete login user data
            case "/delete":
                if (isset($_SESSION["loginUser"])) { //check if the user login 
                    $dbCon = new mysqli($dbServer, $dbUser, $dbPass, $dbName);
                    if ($dbCon->connect_error) {
                        echo json_encode(["message" => "DB connection error. " . $dbCon->connect_error]);
                        $dbCon->close();
                    } else {
                        if ($_POST["email"] != $_SESSION["loginUser"]["email"]) { // if the sent email address doesn't match the lgin user email, can't delete the user account
                            echo json_encode(["message" => "email/password is wrong."]);
                        } else if (!(password_verify($_POST["pass"], $_SESSION["loginUser"]["pass"]))) { // if the sent password doesn't match the lgin user password, can't delete the user account
                            echo json_encode(["message" => "email/password is wrong."]);
                        } else { // if the sent email and password matches the login user ones, delete the user account
                            $delUser = "DELETE FROM user_tb WHERE uid = " . $_SESSION["loginUser"]["uid"];
                            $dbCon->query($delUser);
                            echo json_encode(["message" => "Your acount is deleted successfully!"]);
                            $dbCon->close();
                            // stop session because the login user data is deleted
                            session_unset();
                            session_destroy();
                        }
                    }
                } else {
                    echo json_encode(["logout" => "Login first."]);
                }
                break;

                //buy tickets
            case "/buy":
                if (isset($_SESSION["loginUser"])) { //check if the user login 
                    $dbCon = new mysqli($dbServer, $dbUser, $dbPass, $dbName);
                    if ($dbCon->connect_error) {
                        echo json_encode(["message" => "DB connection error. " . $dbCon->connect_error]);
                        $dbCon->close();
                    } else {
                        $allTickets = json_decode($_POST["ticket"]);
                        // save the bought tickets data to the database
                        foreach ($allTickets as $ticket) {
                            $insertCmd = $dbCon->prepare("INSERT INTO ticket_tb (uid, bdate, type, vdate, time, number) VALUES (?,?,?,?,?,?)");
                            $bdate = date("Y-m-d"); // the date the user buy tickets
                            $insertCmd->bind_param("issssi", $_SESSION["loginUser"]["uid"], $bdate, $ticket->type, $ticket->vdate, $ticket->time, $ticket->number);
                            $insertCmd->execute();
                        }
                        $insertCmd->close();
                        $dbCon->close();
                        echo json_encode(["message" => "Success to buy tickets!"]);
                    }
                } else {
                    echo json_encode(["logout" => "Login first."]);
                }
                break;

                // check order history
            case "/history":
                if (isset($_SESSION["loginUser"])) { //check if the user login 
                    $dbCon = new mysqli($dbServer, $dbUser, $dbPass, $dbName);
                    if ($dbCon->connect_error) {
                        echo json_encode(["message" => "DB connection error. " . $dbCon->connect_error]);
                        $dbCon->close();
                    } else {
                        // select the date the user bought tickets, the tickets type, the visit date, the visit time, the number of tickets from the history_tb
                        $selectCmd = "SELECT bdate,type,vdate,time,number FROM ticket_tb WHERE uid = " . $_SESSION["loginUser"]["uid"];
                        $result = $dbCon->query($selectCmd);
                        $history = [];
                        if ($result->num_rows > 0) { // if the login user has bought tickets, send the tickets data to frontend
                            while ($orderTicket = $result->fetch_assoc()) {
                                array_push($history, $orderTicket);
                            }
                        }
                        echo json_encode($history);
                        $dbCon->close();
                    }
                } else {
                    echo json_encode(["logout" => "Login first."]);
                }
                break;
        }
    }
}
