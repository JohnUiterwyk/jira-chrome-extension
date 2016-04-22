
function JiraChrome()
{
    this.data = {};
}
JiraChrome.prototype.init = function()
{
    chrome.storage.local.get({
        jiraProjects:{},
        confluenceSpaces:{},
        issues:{}
    }, this.onLocalStorageLoaded.bind(this));
    chrome.storage.sync.get({
        atlassianUsername: '',
        atlassianPassword: '',
        atlassianUrl: ''
    }, this.onSyncStorageLoaded.bind(this));

    window.focus();
};

JiraChrome.prototype.onSyncStorageLoaded = function(data)
{
    this.data.atlassianUsername = data.atlassianUsername;
    this.data.atlassianPassword = data.atlassianPassword;
    this.data.atlassianUrl = data.atlassianUrl;
    this.data.jiraBaseUrl = "https://" + this.data.atlassianUrl +"/";
    this.data.basicAuthString =  "Basic " + btoa(data.atlassianUsername + ":" + data.atlassianPassword);
    this.data.ajaxAuthHeader = {
        "Authorization": this.data.basicAuthString
    };

    if(data.atlassianUsername === "" || data.atlassianPassword === "" )
    {
        $('a[href="#options-tab"]').trigger('click');
    }else
    {
        this.updateLists();

    }
};
JiraChrome.prototype.onLocalStorageLoaded = function(data)
{

    this.data.jiraProjects = JSON.parse(data.jiraProjects);
    if(this.data.jiraProjects.length > 0)
    {
        this.refreshJiraList(this.data.jiraProjects);
    }


    this.data.issues = JSON.parse(data.issues);
    if(this.data.issues.length > 0)
    {
        this.refreshIssueList(this.data.issues);
    }


    // this.data.confluenceSpaces = JSON.parse(data.confluenceSpaces);
    // if(this.data.confluenceSpaces.length > 0)
    // {
    //     this.refreshSpaceList(this.data.confluenceSpaces);
    // }
};


// JiraChrome.prototype.doLogin = function()
// {
//     // Saves options to chrome.storage
//     var items = {};
//     items.atlassianUsername = document.getElementById('atlassianUsername').value;
//     items.atlassianPassword = document.getElementById('atlassianPassword').value;
//
//     chrome.storage.sync.set(items, function() {
//         // Update status to let user know options were saved.
//
//         var status = document.getElementById('status');
//         var jiraApiUrl = this.data.jiraBaseUrl+"rest/api/2/project?"+authString;
//         $.ajax
//         ({
//             headers: {
//                 "Authorization": "Basic " + btoa(atlassianUsername + ":" + atlassianPassword)
//             },
//             type: "GET",
//             url:jiraApiUrl
//         }).done(this.refreshJiraList.bind(this));
//     });
// };

JiraChrome.prototype.updateLists = function()
{



    var jiraApiUrl = this.data.jiraBaseUrl+"rest/api/2/project?";
    $.ajax
    ({
        headers: this.data.ajaxAuthHeader,
        type: "GET",
        url:jiraApiUrl
    }).done(this.refreshJiraList.bind(this));

    var issuesApiUrl = this.data.jiraBaseUrl+"rest/api/2/issue/picker?showSubTasks=true";
    $.ajax
    ({
        headers: this.data.ajaxAuthHeader,
        type: "GET",
        url:issuesApiUrl
    }).done(this.refreshIssueList.bind(this));

    // var confluenceApiUrl = this.data.jiraBaseUrl+"wiki/rest/api/space?expand=status&limit=500&"+authString;
    // $.ajax
    // ({
    //     type: "GET",
    //     url:confluenceApiUrl
    // }).done(this.refreshSpaceList.bind(this));




};

JiraChrome.prototype.refreshJiraList = function(projects)
{
    chrome.storage.local.set({jiraProjects:JSON.stringify(projects)});
    $('#jira-project-list').empty();
    for(var i=0; i<projects.length;i++)
    {
        if(projects[i].hasOwnProperty("projectCategory") === false || projects[i].projectCategory.name != "Complete")
        {
            var html = "";
            html +='<li>';
            html +='<a href="'+this.data.jiraBaseUrl+'browse/'+projects[i].key+'" target="new">';
            html +='<div class="project-key">';
            html += projects[i].key+": ";
            html +='</div>';
            html +='<div class="project-name">';
            html += projects[i].name;
            html +='</div>';
            html +='</a>';
            html +='</li>';
            $('#jira-project-list').append(html);
        }
    }
};


JiraChrome.prototype.refreshIssueList = function(issues)
{
    //Confluence returns a object with the spaces in the result property
    if(issues.hasOwnProperty("sections") === true)
    {
        issues = issues.sections[0].issues;
    };
    chrome.storage.local.set({issues:JSON.stringify(issues)});
    $('#jira-issue-list').empty();
    for(var i=0; i<issues.length;i++)
    {
        var html = "";
        html +='<li>';
        html +='<a href="'+this.data.jiraBaseUrl+'browse/'+issues[i].keyHtml+'" target="new">';
        html +='<div class="issue-key">';
        html += issues[i].key+": ";
        html +='</div>';
        html +='<div class="issue-summary">';
        html += issues[i].summary;
        html +='</div>';
        html +='</a>';
        html +='</li>';
        $('#jira-issue-list').append(html);
    }
};

// JiraChrome.prototype.refreshSpaceList = function(spaces)
// {
//     //Confluence returns a object with the spaces in the result property
//     if(spaces.hasOwnProperty("results") === true)
//     {
//         spaces = spaces.results;
//     };
//     chrome.storage.local.set({confluenceSpaces:JSON.stringify(spaces)});
//     $('#con-project-list').empty();
//     for(var i=0; i<spaces.length;i++)
//     {
//         var html = "";
//         html +='<li>';
//         html +='<a href="'+this.data.jiraBaseUrl+'wiki/display/'+spaces[i].key+'" target="new">';
//
//         html +='<div class="space-key">';
//         html += spaces[i].key+": ";
//         html +='</div>';
//         html +='<div class="space-name">';
//         html += spaces[i].name;
//         html +='</div>';
//         html +='</a>';
//         html +='</li>';
//         $('#con-project-list').append(html);
//     }
// };


$( document ).ready(function()
    {
        new JiraChrome().init();
    }
);