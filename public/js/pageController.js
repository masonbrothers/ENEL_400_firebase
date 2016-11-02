realtimePageContainer = document.getElementById("realtimePage");
historyPageContainer = document.getElementById("historyPage")
loginPageContainer = document.getElementById("loginPage");
navbarPageContainer = document.getElementById("myNavbar");



location.hash = '#/';

currentPageSettings();

$(window).on('hashchange', function() {
    currentPageSettings();
});

function currentPageSettings()
{
    console.log(location.hash);

    if (location.hash == '#loggedIn')
    {
        updateValues();
        setInterval(updateValues(), 10000);
        location.hash = '#realtime';
    }
    
    if (location.hash == '#realtime')
    {
        navbarPageContainer.style.display = "block";
        realtimePageContainer.style.display = "block";
        historyPageContainer.style.display = "none";
        loginPageContainer.style.display = "none";
        $('#realTimeTab').addClass("active");
        if ($('#historyTab').hasClass("active"))
            $('#historyTab').removeClass("active");
        if ($('#logoutTab').hasClass("active"))
            $('#logoutTab').removeClass("active");

    }
    else if (location.hash == '#history')
    {
        navbarPageContainer.style.display = "block";
        realtimePageContainer.style.display = "none";
        historyPageContainer.style.display = "block";
        loginPageContainer.style.display = "none";
        if ($('#realTimeTab').hasClass("active"))
            $('#realTimeTab').removeClass("active");
        $('#historyTab').addClass("active");
        if ($('#logoutTab').hasClass("active"))
            $('#logoutTab').removeClass("active");
    }
    else if (location.hash == '#logout')
    {
        if ($('#realTimeTab').hasClass("active"))
            $('#realTimeTab').removeClass("active");
        if ($('#historyTab').hasClass("active"))
            $('#historyTab').removeClass("active");
        $('#logoutTab').addClass("active");
        firebase.auth().signOut().then(function() {
            console.log('Signed Out');
            location.hash = '#/';
            location.reload();
        }, function(err) {
            alert('Cannot Sign Out: ' + err);
            console.log(err);
        });
    }
    else
    {
        navbarPageContainer.style.display = "none";
        realtimePageContainer.style.display = "none";
        historyPageContainer.style.display = "none";
        loginPageContainer.style.display = "block";
    }
}