console.log("test");

/*var ctx = document.getElementById("myChart");

var scatterChart = new Chart(ctx, {
    type: 'line',
    data: {
        datasets: [{
            label: 'Scatter Dataset',
            data: [{
                x: -10,
                y: 0
            }, {
                x: 0,
                y: 10
            }, {
                x: 10,
                y: 5
            }]
        }]
    },
    options: {
        scales: {
            xAxes: [{
                type: 'linear',
                position: 'bottom',
                scaleLabel: {
                    display: true,
                    labelString: 'Time (days)'
                }
            }],
            yAxes: [{
                scaleLabel: {
                    display: true,
                    labelString: 'Temperature (°C)'
                }
            }]
        }
    }
});
*/
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
