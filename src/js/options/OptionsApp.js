// Saves options to chrome.storage
function JiraChromeOptions()
{

}

JiraChromeOptions.prototype.init = function()
{
    document.addEventListener('DOMContentLoaded', this.restoreOptions);
    document.getElementById('save').addEventListener('click', this.saveOptions);
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
        status.textContent = 'Options saved.';
        setTimeout(function() {
            status.textContent = '';
        }, 2000);
    });
};



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