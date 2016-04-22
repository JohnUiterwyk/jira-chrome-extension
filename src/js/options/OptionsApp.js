// Saves options to chrome.storage
function JiraChromeOptions()
{
    this.statusTimer = null;
}
JiraChromeOptions.prototype.init = function()
{
    document.addEventListener('DOMContentLoaded', this.restoreOptions.bind(this));
    document.getElementById('save').addEventListener('click', this.saveOptions.bind(this));
}
JiraChromeOptions.prototype.saveOptions = function()
{

    var items = {};
    items.atlassianUsername = document.getElementById('atlassianUsername').value;
    items.atlassianPassword = document.getElementById('atlassianPassword').value;
    items.atlassianUrl = document.getElementById('atlassianUrl').value;
    chrome.storage.sync.set(items, function() {
        // Update status to let user know options were saved.

        var status = document.getElementById('status');
        status.textContent = 'Options saved. Validating credentials';
        setTimeout(function() {
            status.textContent = '';
        }, 2000);
    });
    //validate
    var jiraUrl = "https://" + items.atlassianUrl +"/rest/api/2/permissions";
    var ajaxAuthHeader = {
        "Authorization": "Basic " + btoa(items.atlassianUsername + ":" + items.atlassianPassword)
    };

    var that = this;
    $.ajax
    ({
        headers: ajaxAuthHeader,
        type: "GET",
        url:jiraUrl
    }).success(function(result)
    {
        if(result)
        {
            that.updateStatus("Authentication Passed.");
            location.reload();
        }else
        {
            that.updateStatus("Authentication Failed.");

        }
    }).error(function()
    {
        that.updateStatus("Authentication Failed.");
    });
};

JiraChromeOptions.prototype.updateStatus = function(message)
{
        // Update status to let user know options were saved.
        clearTimeout(this.statusTimer);
        var status = document.getElementById('status');
        status.textContent = message;
        this.statusTimer = setTimeout(function() {
            status.textContent = '';
        }, 2000);
}



// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
JiraChromeOptions.prototype.restoreOptions = function(){
    // Use default value color = 'red' and likesColor = true.
    chrome.storage.sync.get({
        atlassianUsername: '',
        atlassianPassword: '',
        atlassianUrl: ''
    }, function(items) {
        document.getElementById('atlassianUsername').value = items.atlassianUsername;
        document.getElementById('atlassianPassword').value = items.atlassianPassword;
        document.getElementById('atlassianUrl').value = items.atlassianUrl;
    });
};

var jiraChromeOptions = new JiraChromeOptions();
jiraChromeOptions.init();