/*
pipwerks-scorm-api-wrapper
v1.1.20210518
https://github.com/pipwerks/scorm-api-wrapper

Copyright (c) 2008-2021 Philip Hutchison
MIT-style license: http://pipwerks.mit-license.org/
This wrapper works with both SCORM 1.2 and SCORM 2004.
You don't need to modify this script for general use.
Extended to allow no-op if SCORM API not found, controlled by strictFindAPI.
*/

var pipwerks = {}; // pipwerks namespace
pipwerks.UTILS = {}; // UTILS namespace
pipwerks.debug = { isActive: true }; // Enable (true) or disable (false) for debug output
pipwerks.SCORM = { // SCORM namespace
    version: null, // Stores the SCORM version type (1.2 or 2004)
    handleCompletionStatus: true, // Whether or not the wrapper should automatically handle the completion status
    handleExitMode: true, // Whether or not the wrapper should automatically handle the exit mode
    API: {
        handle: null, // Main SCORM API handle
        isFound: false // True if API handle is found
    },
    connection: { isActive: false }, // True if the connection is active
    data: {
        completionStatus: null, // cmi.core.lesson_status or cmi.completion_status
        exitStatus: null // cmi.core.exit or cmi.exit
    },
    configure: function(options) {
        if (options) {
            if (options.debug !== undefined) {
                pipwerks.debug.isActive = options.debug;
            }
            if (options.handleCompletionStatus !== undefined) {
                this.handleCompletionStatus = options.handleCompletionStatus;
            }
            if (options.handleExitMode !== undefined) {
                this.handleExitMode = options.handleExitMode;
            }
            if (options.strictFindAPI !== undefined) {
                this.strictFindAPI = options.strictFindAPI;
            }
        }
    },
    strictFindAPI: false // If true, init() will fail if API not found. If false, it will allow calls to a no-op API.
};


/* --------------------------------------------------------------------------------
   pipwerks.SCORM.isAvailable
   A simple function to allow Flash content to verify that the SCORM API
   is available.

   Parameters: None
   Returns:    Boolean (true if API is available, false if not)
----------------------------------------------------------------------------------- */

pipwerks.SCORM.isAvailable = function() {
    return true;
};


/* --------------------------------------------------------------------------------
   pipwerks.SCORM.API.find(window)
   Looks for an object named API in the current window and direct parent windows.

   Parameters: window (the browser window object).
   Returns:    Object (the API object if found, null otherwise).
----------------------------------------------------------------------------------- */

pipwerks.SCORM.API.find = function(win) {

    var API = null,
        findAttempts = 0,
        findAttemptLimit = 500,
        traceMsgPrefix = "SCORM.API.find",
        scorm = pipwerks.SCORM,
        previousWin = win; // To prevent infinite loops with self-referencing parent windows

    while ((!win.API && !win.API_1484_11) &&
        (win.parent) &&
        (win.parent != win) &&
        (findAttempts <= findAttemptLimit)) {

        findAttempts++;
        win = win.parent;
        // Check if the current window is the same as the previous one to detect loops
        if (win === previousWin) {
            pipwerks.UTILS.trace(traceMsgPrefix + ": Detected parent window loop. Aborting search.");
            break;
        }
        previousWin = win;
    }

    // If the API doesn't exist in the window we stopped at, or if we reached the attempt limit
    if (!win.API && !win.API_1484_11 && findAttempts === findAttemptLimit) {
        pipwerks.UTILS.trace(traceMsgPrefix + ": Reached find attempt limit. API not found.");
        // Optionally, you could set API to a dummy object here if strictFindAPI is false,
        // but the current logic handles API.isFound for that.
    }


    // Note: The SCORM standard is that window.API should be null if not found.
    // But some bad LMSs might set it to an empty object {} or undefined.
    // So we need to check for these conditions.

    if (win.API_1484_11) { // SCORM 2004
        scorm.version = "2004";
        API = win.API_1484_11;
    } else if (win.API) { // SCORM 1.2
        scorm.version = "1.2";
        API = win.API;
    }


    if (API) {
        pipwerks.UTILS.trace(traceMsgPrefix + ": API found. Version: " + scorm.version);
        scorm.API.isFound = true;
    } else {
        pipwerks.UTILS.trace(traceMsgPrefix + ": Error finding API. \nFind attempts: " + findAttempts + ". \nFind attempt limit: " + findAttemptLimit);
        scorm.API.isFound = false;
    }

    return API;

};


/* --------------------------------------------------------------------------------
   pipwerks.SCORM.API.get()
   Looks for an object named API, first in the current window's frame
   hierarchy and then, if necessary, in the current window's opener window
   hierarchy.

   Parameters: None
   Returns:    Object (the API object if found, null otherwise)
----------------------------------------------------------------------------------- */

pipwerks.SCORM.API.get = function() {

    var API = null,
        scorm = pipwerks.SCORM,
        utils = pipwerks.UTILS,
        traceMsgPrefix = "SCORM.API.get";

    if (!scorm.API.handle) { // Check if the handle is already set

        API = scorm.API.find(window);

        if (!API && window.opener && typeof window.opener !== "undefined") {
            utils.trace(traceMsgPrefix + ": API not found in current window, looking in opener");
            API = scorm.API.find(window.opener);
        }

        if (API) {
            scorm.API.handle = API;
        } else {
             // If strictFindAPI is false, create a no-op API
            if (!scorm.strictFindAPI) {
                utils.trace(traceMsgPrefix + ": API not found and strictFindAPI is false. Using no-op API.");
                scorm.API.handle = pipwerks.SCORM.API.noOp;
                scorm.API.isFound = false; // Explicitly set isFound to false for no-op
            } else {
                 utils.trace(traceMsgPrefix + ": Error finding API. \nStrictFindAPI is true.");
            }
        }
    }


    return scorm.API.handle;
};

// No-op API implementation
pipwerks.SCORM.API.noOp = {
    LMSInitialize: function() { pipwerks.UTILS.trace("LMSInitialize (no-op)"); return "true"; },
    LMSFinish: function() { pipwerks.UTILS.trace("LMSFinish (no-op)"); return "true"; },
    LMSGetValue: function(name) { pipwerks.UTILS.trace("LMSGetValue (no-op) for " + name); return ""; },
    LMSSetValue: function(name, value) { pipwerks.UTILS.trace("LMSSetValue (no-op) for " + name + " = " + value); return "true"; },
    LMSCommit: function() { pipwerks.UTILS.trace("LMSCommit (no-op)"); return "true"; },
    LMSGetLastError: function() { pipwerks.UTILS.trace("LMSGetLastError (no-op)"); return "0"; },
    LMSGetErrorString: function(errorCode) { pipwerks.UTILS.trace("LMSGetErrorString (no-op) for " + errorCode); return "No error"; },
    LMSGetDiagnostic: function(errorCode) { pipwerks.UTILS.trace("LMSGetDiagnostic (no-op) for " + errorCode); return "No diagnostic"; }
};


/* --------------------------------------------------------------------------------
   pipwerks.SCORM.init()
   Initializes the SCORM connection.

   Parameters: None
   Returns:    Boolean (true if successful, false if failed)
----------------------------------------------------------------------------------- */

pipwerks.SCORM.init = pipwerks.SCORM.connection.initialize = function() {

    var success = false,
        scorm = pipwerks.SCORM,
        utils = pipwerks.UTILS,
        traceMsgPrefix = "SCORM.connection.initialize";


    utils.trace(traceMsgPrefix + ": Initializing connection.");

    if (!scorm.connection.isActive) {

        var API = scorm.API.get(); // Force finding API if not already found

        if (API) {
             if (scorm.API.isFound || !scorm.strictFindAPI) { // Proceed if API found OR if we allow no-op
                switch (scorm.version) {
                    case "1.2":
                        success = (API.LMSInitialize("") === "true");
                        break;
                    case "2004":
                        success = (API.Initialize("") === "true");
                        break;
                }
            }


            if (success) {
                // Double-check that connection is active and working before returning `true`
                var err = utils.getLastError();

                if (err.code !== "0" && err.code !== 0) { // Added check for numeric 0
                    success = false;
                    utils.trace(traceMsgPrefix + ": Error initializing connection. \nError code: " + err.code + "\nError message: " + err.message);
                } else {
                    scorm.connection.isActive = true;
                    utils.trace(traceMsgPrefix + ": Connection initialized successfully.");
                }

            } else {
                 // If success is false here, it means LMSInitialize/Initialize failed OR API was no-op and didn't set it.
                utils.trace(traceMsgPrefix + ": Error initializing connection. Success was false. LMSInitialize/Initialize might have failed or API is no-op.");
                if(!scorm.API.isFound && scorm.strictFindAPI) {
                    utils.trace(traceMsgPrefix + ": strictFindAPI is true and API was not found. Initialization failed definitively.");
                }
            }

        } else {
            utils.trace(traceMsgPrefix + ": Error initializing connection. API handle not found and strictFindAPI is true or no-op not configured properly.");
        }

    } else {
        utils.trace(traceMsgPrefix + ": Connection already active.");
    }

    return success;

};


/* --------------------------------------------------------------------------------
   pipwerks.SCORM.terminate()
   Terminates the SCORM connection.

   Parameters: None
   Returns:    Boolean (true if successful, false if failed)
----------------------------------------------------------------------------------- */

pipwerks.SCORM.terminate = pipwerks.SCORM.quit = pipwerks.SCORM.connection.terminate = function() {

    var success = false,
        scorm = pipwerks.SCORM,
        utils = pipwerks.UTILS,
        traceMsgPrefix = "SCORM.connection.terminate";


    if (scorm.connection.isActive) {

        var API = scorm.API.get();

        if (API) {
            if (scorm.API.isFound || !scorm.strictFindAPI) {
                if (scorm.handleCompletionStatus) {
                    // Get current status
                    scorm.data.completionStatus = scorm.status();
                    // If status is not complete, mark it as incomplete
                    if (scorm.data.completionStatus !== "completed" && scorm.data.completionStatus !== "passed") {
                         if (scorm.data.completionStatus === null || scorm.data.completionStatus === "unknown" || scorm.data.completionStatus === "not attempted") {
                            scorm.status("incomplete");
                        }
                    }
                }

                if (scorm.handleExitMode && !scorm.data.exitStatus) {
                    // If not manually set, determine exit mode
                    if (scorm.data.completionStatus === "completed" || scorm.data.completionStatus === "passed") {
                        scorm.exit("logout"); // Normal exit for completed content
                    } else {
                        scorm.exit("suspend"); // Suspend for incomplete content
                    }
                }


                switch (scorm.version) {
                    case "1.2":
                        success = (API.LMSFinish("") === "true");
                        break;
                    case "2004":
                        success = (API.Terminate("") === "true");
                        break;
                }
            }


            if (success) {
                scorm.connection.isActive = false;
                 utils.trace(traceMsgPrefix + ": Connection terminated successfully.");
            } else {
                var err = utils.getLastError();
                utils.trace(traceMsgPrefix + ": Error terminating connection. \nError code: " + err.code + "\nError message: " + err.message);
            }

        } else {
            utils.trace(traceMsgPrefix + ": Error terminating connection. API handle not found.");
        }

    } else {
        utils.trace(traceMsgPrefix + ": Connection not active.");
    }

    return success;

};


/* --------------------------------------------------------------------------------
   pipwerks.SCORM.get(parameter)
   Requests information from the LMS.

   Parameters: parameter (string, SCORM data model element)
   Returns:    string (the value of the specified data model element)
----------------------------------------------------------------------------------- */

pipwerks.SCORM.get = pipwerks.SCORM.data.get = function(parameter) {

    var value = "", // Initialize with empty string for SCORM 1.2 compatibility if element not found
        scorm = pipwerks.SCORM,
        utils = pipwerks.UTILS,
        traceMsgPrefix = "SCORM.data.get('" + parameter + "')";


    if (scorm.connection.isActive) {

        var API = scorm.API.get();

        if (API) {
            if (scorm.API.isFound || !scorm.strictFindAPI) {
                switch (scorm.version) {
                    case "1.2":
                        value = API.LMSGetValue(parameter);
                        break;
                    case "2004":
                        value = API.GetValue(parameter);
                        break;
                }
            }

            var err = utils.getLastError();
            // An error was encountered trying to GET the data
            if (err.code !== "0" && err.code !== 0) { // Allow numeric 0
                utils.trace(traceMsgPrefix + ": Error getting parameter. \nError code: " + err.code + "\nError message: " + err.message + "\nReturning empty string.");
                value = ""; // Return empty string if SCORM error, as per some interpretations of 1.2
            } else {
                 utils.trace(traceMsgPrefix + ": Value = " + value);
            }

        } else {
            utils.trace(traceMsgPrefix + ": Error getting parameter. API handle not found.");
        }

    } else {
        utils.trace(traceMsgPrefix + ": Error getting parameter. Connection not active.");
    }


    return String(value); // Ensure return is always a string

};


/* --------------------------------------------------------------------------------
   pipwerks.SCORM.set()
   Tells the LMS to assign the value to the named data model element.
   Also stores the SCO's completion status in a variable named
   pipwerks.SCORM.data.completionStatus. This variable is checked whenever
   pipwerks.SCORM.connection.terminate() is invoked.

   Parameters: parameter (string). The data model element
               value (string). The value for the data model element
   Returns:    Boolean (true if successful, false if failed)
----------------------------------------------------------------------------------- */

pipwerks.SCORM.set = pipwerks.SCORM.data.set = function(parameter, value) {

    var success = false,
        scorm = pipwerks.SCORM,
        utils = pipwerks.UTILS,
        traceMsgPrefix = "SCORM.data.set('" + parameter + "', '" + value + "')";


    if (scorm.connection.isActive) {

        var API = scorm.API.get();

        if (API) {
             if (scorm.API.isFound || !scorm.strictFindAPI) {
                switch (scorm.version) {
                    case "1.2":
                        success = (API.LMSSetValue(parameter, value) === "true");
                        break;
                    case "2004":
                        success = (API.SetValue(parameter, value) === "true");
                        break;
                }
            }


            if (success) {
                utils.trace(traceMsgPrefix + ": Parameter set successfully.");
                if (parameter === "cmi.core.lesson_status" || parameter === "cmi.completion_status") {
                    scorm.data.completionStatus = value;
                }
                if (parameter === "cmi.core.exit" || parameter === "cmi.exit") {
                    scorm.data.exitStatus = value;
                }

            } else {
                var err = utils.getLastError();
                utils.trace(traceMsgPrefix + ": Error setting parameter. \nError code: " + err.code + "\nError message: " + err.message);
            }

        } else {
            utils.trace(traceMsgPrefix + ": Error setting parameter. API handle not found.");
        }

    } else {
        utils.trace(traceMsgPrefix + ": Error setting parameter. Connection not active.");
    }

    return success;

};


/* --------------------------------------------------------------------------------
   pipwerks.SCORM.save()
   Instructs the LMS to persist all data to this point in the session.

   Parameters: None
   Returns:    Boolean (true if successful, false if failed)
----------------------------------------------------------------------------------- */

pipwerks.SCORM.save = pipwerks.SCORM.data.save = function() {

    var success = false,
        scorm = pipwerks.SCORM,
        utils = pipwerks.UTILS,
        traceMsgPrefix = "SCORM.data.save";


    if (scorm.connection.isActive) {

        var API = scorm.API.get();

        if (API) {
            if (scorm.API.isFound || !scorm.strictFindAPI) {
                switch (scorm.version) {
                    case "1.2":
                        success = (API.LMSCommit("") === "true");
                        break;
                    case "2004":
                        success = (API.Commit("") === "true");
                        break;
                }
            }


            if (success) {
                utils.trace(traceMsgPrefix + ": Data saved successfully.");
            } else {
                var err = utils.getLastError();
                utils.trace(traceMsgPrefix + ": Error saving data. \nError code: " + err.code + "\nError message: " + err.message);
            }

        } else {
            utils.trace(traceMsgPrefix + ": Error saving data. API handle not found.");
        }

    } else {
        utils.trace(traceMsgPrefix + ": Error saving data. Connection not active.");
    }

    return success;

};


/* --------------------------------------------------------------------------------
   pipwerks.SCORM.status("status")
   Convenience function for setting and getting SCORM completion status.

   Parameters: status (string, optional). If provided, sets the SCORM
               completion status.
   Returns:    string (the current SCORM completion status)
----------------------------------------------------------------------------------- */

pipwerks.SCORM.status = function(status) {

    var currentStatus = null,
        scorm = pipwerks.SCORM,
        traceMsgPrefix = "SCORM.status";


    if (status) { // If a status was passed, set it

        scorm.set((scorm.version === "2004" ? "cmi.completion_status" : "cmi.core.lesson_status"), status);
        currentStatus = status; // Update currentStatus to the one just set.

    } else { // If no status was passed, get the current status

        currentStatus = scorm.get((scorm.version === "2004" ? "cmi.completion_status" : "cmi.core.lesson_status"));

    }

    // Store the status in the wrapper's data object
    scorm.data.completionStatus = currentStatus;
    pipwerks.UTILS.trace(traceMsgPrefix + ": Completion status = " + currentStatus);

    return currentStatus;

};

/* --------------------------------------------------------------------------------
   pipwerks.SCORM.exit("mode")
   Convenience function for setting and getting SCORM exit mode.
   SCORM 1.2: cmi.core.exit (״suspend״, ״logout״, ״time-out״, ״״)
   SCORM 2004: cmi.exit (״suspend״, ״normal״, ״logout״, ״time-out״)

   Parameters: mode (string, optional). If provided, sets the SCORM exit mode.
   Returns:    string (the current SCORM exit mode)
----------------------------------------------------------------------------------- */
pipwerks.SCORM.exit = function(mode) {
    var currentExitMode = null,
        scorm = pipwerks.SCORM,
        traceMsgPrefix = "SCORM.exit";

    if (mode) {
        scorm.set((scorm.version === "2004" ? "cmi.exit" : "cmi.core.exit"), mode);
        currentExitMode = mode;
    } else {
        currentExitMode = scorm.get((scorm.version === "2004" ? "cmi.exit" : "cmi.core.exit"));
    }

    scorm.data.exitStatus = currentExitMode;
    pipwerks.UTILS.trace(traceMsgPrefix + ": Exit mode = " + currentExitMode);
    return currentExitMode;
};


// ------------------------------------------------------------------------- //
// --- pipwerks.UTILS functions -------------------------------------------- //
// ------------------------------------------------------------------------- //


/* --------------------------------------------------------------------------------
   pipwerks.UTILS.trace(message)
   Displays error messages when pipwerks.debug.isActive is true.

   Parameters: message (string)
   Returns:    None
----------------------------------------------------------------------------------- */

pipwerks.UTILS.trace = function(msg) {

    if (pipwerks.debug.isActive) {

        if (window.console && window.console.log) {
            window.console.log(msg);
        }
        // else { alert(msg); } // Optionally use alerts if console is not available

    }

};

/* --------------------------------------------------------------------------------
   pipwerks.UTILS.getLastError()
   Requests the error code and textual description from the LMS.

   Parameters: None
   Returns:    Object {code: "string", message: "string"}
----------------------------------------------------------------------------------- */
pipwerks.UTILS.getLastError = function() {
    var scorm = pipwerks.SCORM,
        API = scorm.API.get(),
        errCode = "0", // Default to "0" (No Error)
        errMessage = "No error.",
        traceMsgPrefix = "pipwerks.UTILS.getLastError";

    if (API && (scorm.API.isFound || !scorm.strictFindAPI)) {
        switch (scorm.version) {
            case "1.2":
                errCode = API.LMSGetLastError();
                errMessage = API.LMSGetErrorString(errCode);
                break;
            case "2004":
                errCode = API.GetLastError();
                errMessage = API.GetErrorString(errCode); // Corrected: SCORM 2004 uses GetErrorString
                // Optionally, you could also get GetDiagnostic: API.GetDiagnostic(errCode);
                break;
        }
    } else {
        // This case should ideally not be reached if API is no-op or strictFindAPI handles it.
        pipwerks.UTILS.trace(traceMsgPrefix + ": API not available to get last error.");
        errCode = "-1"; // Indicate an internal wrapper issue or API truly not found
        errMessage = "SCORM API not found or not initialized.";
    }
    
    // Ensure errCode is always a string as per SCORM specs for LMSGetLastError
    errCode = String(errCode); 

    return {
        code: errCode,
        message: errMessage
    };
};

// Make pipwerks object available globally, if not already (e.g., in a module environment)
if (typeof window !== 'undefined') {
    window.pipwerks = pipwerks;
}
// If used as a module, you might want to export it
if (typeof module !== 'undefined' && module.exports) {
    module.exports = pipwerks;
}
