var host = "https://"+window.location.host;
// console.log(host)
// var host = 'http://47.95.220.122:90'
// var host = 'https://api.51los.com'
var _phoneNum, _userType, _userCode, dropload
var pages = 1
var isLastPage = false
var isUserInited = false
var dataStatistics = {
    "yesterdayOrderTempPirce": 0.00,
    "todayAddAgent": 0,
    "yesterdayOrderCount": 0,
    "todayOrderCount": 0,
    "todayOrderTempPirce": 0.00,
    "yesterdayAddUser": 0,
    "todayAddUser": 0,
    "yesterdayAddAgent": 0
}

$(document).ready(function () {
    if (!$.cookie('session')) {
        myRedirect('./login.html')
    } else {
        console.log($.cookie('session'))
        getTeamInfo()
        getDataStatistics()
        getCommissionInfo()        
    }
});

function initUserList() {
    isUserInited = true
    dropload = $('.user-body').dropload({
        scrollArea: window,
        domDown: {
            domClass: 'dropload-down',
            domRefresh: '<div class="dropload-refresh">↑上拉加载更多</div>',
            domLoad: '<div class="dropload-load">○加载中...</div>',
            domNoData: '<div class="dropload-noData">没有更多数据</div>'
        },
        loadDownFn: function (me) {
            console.log(me)
            if (isLastPage) {
                me.noData();
                me.resetload();
                return
            }
            getUserList2(function (res) {
                if (!res.Data.lastPage) {
                    pages += 1
                } else {
                    isLastPage = true
                }
                me.resetload();
            })
        }
    });
}

function getTeamInfo() {
    $.ajax({
        method: "POST",
        url: host + '/operator/teamInfo',
        data: {
            loginName: GetQueryString('loginName'),
            session: $.cookie('session')
        },
        success: function (res) {
            if (res.status == 0) {
                myRedirect('./login.html')
            }
            $('.total-data').html(res.Data.allUserCount)
            $('#agentCount').html(res.Data.agentCount)
            $('#levelACount').html(res.Data.levelACount)
            $('#promotionCount').html(res.Data.promotionCount)
            $('#userCount').html(res.Data.userCount)
            $('#userCountRate').attr('data-percent', res.Data.allUserCount == 0 ? 0 : res.Data.agentCount / res.Data.allUserCount * 100)
            $('#userCountRate').attr('data-text', (res.Data.allUserCount == 0 ? 0 : res.Data.agentCount / res.Data.allUserCount * 100).toFixed(2) + '%')
            $('#fansRate').attr('data-percent', res.Data.allUserCount == 0 ? 0 : res.Data.levelACount / res.Data.allUserCount * 100)
            $('#fansRate').attr('data-text', (res.Data.allUserCount == 0 ? 0 : res.Data.levelACount / res.Data.allUserCount * 100).toFixed(2) + '%')
            $('#userCountRate').circliful();
            $('#fansRate').circliful();
        }
    })
}

function getDataStatistics() {
    $.ajax({
        method: "POST",
        url: host + "/operator/dataStatistics",
        data: {
            loginName: GetQueryString('loginName'),
            session: $.cookie('session')
        },
        success: function (res) {
            if (res.status == 0) {
                myRedirect('./login.html')
            }
            dataStatistics = res.Data
            setTodayData()
        }
    })
}

function getCommissionInfo() {
    $.ajax({
        method: "POST",
        url: host + "/operator/commissionInfo",
        data: {
            loginName: GetQueryString('loginName'),
            session: $.cookie('session')
        },
        success: function (res) {
            if (res.status == 0) {
                myRedirect('./login.html')
            }
            $('#total-earning').html(res.Data.total)
            $('#preMonthSettle').html(res.Data.preMonthSettle)
            $('#preMonthTemp').html(res.Data.preMonthTemp)
            $('#curMonthTemp').html(res.Data.curMonthTemp)
        }
    })
}

function getUserList() {
    $.ajax({
        method: "POST",
        url: host + '/operator/userList',
        data: {
            loginName: GetQueryString('loginName'),
            session: $.cookie('session'),
            phoneNum: _phoneNum,
            userType: _userType,
            pageSize: 10,
            pages: pages
        },
        success: function (res) {
            res.Data.list.forEach(function (item) {
                var _html = `<div class="user-body-item">
                            <div class="user-body-avatar">
                                <img class="avatar" src="${item.photoUrl ? item.photoUrl : './assets/img/header.png'}" alt="">
                            </div>
                            <div class="user-body-info">
                                <div class="user-body-top">
                                    ${item.phoneNum}
                                    <img class="label" src="./assets/img/${item.userType == 1 ? 'agent-label' : 'user-label'}.png" alt="">
                                </div>
                                <div class="user-body-middle">
                                    <span>${item.nickName ? item.nickName : ''}</span>
                                    <span class="user-body-time">
                                        <img class="icon" src="./assets/img/clock.png" alt="">${item.regTime.split(' ')[0]}</span>
                                </div>
                            </div>
                            <div onclick="upLevel('${item.userCode}')" style="display:${item.userType == 0 && GetQueryString('type') != 1 ? 'block' : 'none'}" class="up-btn">升级</div>
                        </div>`
                $('.user-body-wrap').append(_html)
            });

        }
    })
}

function getUserList2(callback) {
    $.ajax({
        method: "POST",
        url: host + '/operator/userList',
        data: {
            loginName: GetQueryString('loginName'),
            session: $.cookie('session'),
            phoneNum: _phoneNum,
            userType: _userType,
            pageSize: 10,
            pages: pages
        },
        success: function (res) {
            // console.log(res)                
            res.Data.list.forEach(function (item) {
                var _html = `<div class="user-body-item">
                            <div class="user-body-avatar">
                                <img class="avatar" src="${item.photoUrl ? item.photoUrl : './assets/img/header.png'}" alt="">
                            </div>
                            <div class="user-body-info">
                                <div class="user-body-top">
                                    ${item.phoneNum}
                                    <img class="label" src="./assets/img/${item.userType == 1 ? 'agent-label' : 'user-label'}.png" alt="">
                                </div>
                                <div class="user-body-middle">
                                    <span>${item.nickName ? item.nickName : ''}</span>
                                    <span class="user-body-time">
                                        <img class="icon" src="./assets/img/clock.png" alt="">${item.regTime.split(' ')[0]}</span>
                                </div>
                            </div>
                            <div onclick="upLevel('${item.userCode}')" style="display:${item.userType == 0 && GetQueryString('type') != 1 ? 'block' : 'none'}" class="up-btn">升级</div>
                        </div>`
                $('.user-body-wrap').append(_html)
            });
            callback(res)
        }
    })
}

function setTodayData() {
    $('#addUser').html(dataStatistics.todayAddUser)
    $('#orderCount').html(dataStatistics.todayOrderCount)
    $('#addAgent').html(dataStatistics.todayAddAgent)
    $('#orderTempPirce').html(dataStatistics.todayOrderTempPirce)
}

function setYesterdayData() {
    $('#addUser').html(dataStatistics.yesterdayAddUser)
    $('#orderCount').html(dataStatistics.yesterdayOrderCount)
    $('#addAgent').html(dataStatistics.yesterdayAddAgent)
    $('#orderTempPirce').html(dataStatistics.yesterdayOrderTempPirce)
}

function chooseToday() {
    setTodayData()
    $('.today-data').addClass('active2')
    $('.today-data').removeClass('active')
    $('.yesterday-data').addClass('active')
    $('.yesterday-data').removeClass('active2')
}

function chooseYesterday() {
    setYesterdayData()
    $('.today-data').addClass('active')
    $('.today-data').removeClass('active2')
    $('.yesterday-data').addClass('active2')
    $('.yesterday-data').removeClass('active')
}

function chooseStatistic() {
    $('#statistic').css('display', 'block')
    $('#user').css('display', 'none')
    $('#statistic-icon').attr('src', './assets/img/count-active.png')
    $('#statistic-text').addClass('active')
    $('#user-icon').attr('src', './assets/img/user.png')
    $('#user-text').removeClass('active')
}

function chooseUser() {
    $('#statistic').css('display', 'none')
    $('#user').css('display', 'block')
    $('#statistic-icon').attr('src', './assets/img/count.png')
    $('#statistic-text').removeClass('active')
    $('#user-icon').attr('src', './assets/img/user-active.png')
    $('#user-text').addClass('active')
    if(isUserInited) return
    initUserList()
}

function upLevel(userCode) {
    console.log('up level:' + userCode)
    _userCode = userCode
    $('#alert').css('display', 'block')
}

function alertCancel() {
    $('#alert').css('display', 'none')
}

function upLevelSubmit() {
    $.ajax({
        method: "POST",
        url: host + "/operator/userToAgent",
        data: {
            loginName: GetQueryString('loginName'),
            session: $.cookie('session'),
            userCode: _userCode
        },
        success: function (res) {
            console.log(res)
            if (res.status == 1) {
                $.alert({
                    title: '提示!',
                    content: '用户升级成功!',
                    useBootstrap: false,
                    boxWidth: '70%'
                });
                $('.user-body-wrap').html('')
                dropload.noData(false)
                dropload.resetload()
                // getUserList2(function (res) { })
            } else {
                $.alert({
                    title: '提示!',
                    content: res.errorMsg,
                    useBootstrap: false,
                    boxWidth: '70%'
                });
            }
            $('#alert').css('display', 'none')
        }
    })
}

function chooseType(val) {
    // console.log(val)
    // _phoneNum = null
    pages = 1
    isLastPage = false
    switch (val) {
        case 'all':
            _userType = null
            break
        case 'agent':
            _userType = 1
            break
        case 'user':
            _userType = 0
            break
        default:
            break
    }
    $('.user-body-wrap').html('')
    dropload.noData(false)
    dropload.resetload()
    // getUserList2(function (res) { })
}

function searchUser() {
    _userType = null
    isLastPage = false
    pages = 1
    _phoneNum = $('#search').val()
    console.log(_phoneNum)
    $('.user-body-wrap').html('')
    dropload.noData(false)
    dropload.resetload()
    // getUserList2(function (res) { })
}
