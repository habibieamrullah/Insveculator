var appTitle = "insveculator";
var appData = {};
if(localStorage.getItem(appTitle) === null){
	appData = {
		cash : 10000,
		moneyInvested : 0,
		currentInvVal : 0,
		currentPL : 0,
		trades : [],
		companies : [],
		textSize : 12
	}
	appData.companies.push({name : "Banana Computers", values : [4522]});
	appData.companies.push({name : "Giggle Tech", values : [2141]});
	appData.companies.push({name : "Nanosoft", values : [4854]});
	appData.companies.push({name : "Jugle Amazoo", values : [5644]});
	appData.companies.push({name : "Wallymart", values : [9854]});
	appData.companies.push({name : "Exxotic Meuble", values : [2214]});
	appData.companies.push({name : "Folks Motors", values : [5778]});
	appData.companies.push({name : "AT&X Telecom", values : [9532]});
	appData.companies.push({name : "Verizoom", values : [1444]});
	appData.companies.push({name : "Hebron Oil", values : [3694]});
	localStorage.setItem(appTitle, JSON.stringify(appData));
}else{
	appData = JSON.parse(localStorage.getItem(appTitle));
	document.getElementsByTagName("body")[0].style.fontSize = appData.textSize + "px";
}

play();

var appInterval;
function play(){
	appInterval = setInterval(function(){
		document.getElementById("companies").innerHTML = generateNew();
		updateChart(selectedCompany);
		updateTrades();
		updateSummary();
		localStorage.setItem(appTitle, JSON.stringify(appData));
	}, 1987);
}

function pause(){
	clearInterval(appInterval);
}

function generateNew(){
	var content = "<h3>Companies list:</h3>";
	var change;
	for(var i = 0; i < appData.companies.length; i++){
		var chPerc = Math.random() * 2;
		var minOrPlus;
		if(Math.random() > .5){
			change = appData.companies[i].values[appData.companies[i].values.length-1] * (chPerc/100);
			appData.companies[i].values.push(appData.companies[i].values[appData.companies[i].values.length-1] + change);
			change = change.toFixed(2);
			change = "<span style='float: right; color: lime'> + " + (change/appData.companies[i].values[appData.companies[i].values.length-1]).toFixed(4) + "% ($+" + change + ")</span>";
		}else{
			change = appData.companies[i].values[appData.companies[i].values.length-1] * (chPerc/100);
			appData.companies[i].values.push(appData.companies[i].values[appData.companies[i].values.length-1] -	change);
			change = change.toFixed(2);
			change = "<span style='float: right; color: red'> - " + (change/appData.companies[i].values[appData.companies[i].values.length-1]).toFixed(4) + "% ($-" + change + ")</span>";
		}
		if(appData.companies[i].values.length > 313) appData.companies[i].values.splice(0, 1);
		content += "<div class='blockList' onclick=showStock("+i+")>" + appData.companies[i].name + "<br/>$" + appData.companies[i].values[appData.companies[i].values.length-1].toFixed(2) + change + "</div>";
	}
	return content + "<hr />";
}

function resetGame(){
	localStorage.removeItem(appTitle);
	location.reload();
}

var stockChartVisible = false;
var selectedCompany;
function showStock(x){	
	stockChartVisible = true;
	selectedCompany = x;
	document.getElementById("shownStock").style.display = "block";
	document.getElementById("stockName").innerHTML= "Please wait...";
}

var chartData;
var chart;
function updateChart(x){
	if(stockChartVisible){
		document.getElementById("shownStock").style.display = "block";
		document.getElementById("stockName").innerHTML= appData.companies[x].name + "'s stock price chart:";
		
		chart = new zkCharts("fxChart", 300);
		chart.initialize();
		chartData = appData.companies[x].values;
		chart.drawForexLineChart(chartData, 0);
		
	} 
}

function closeShownStock(){
	document.getElementById("shownStock").style.display = "none";
	stockChartVisible = false;
	chartData = {};
	chart.initialize();
}

function hideAll(){
	document.getElementById("summary").style.display = "none";
	document.getElementById("companies").style.display = "none";
	document.getElementById("trades").style.display = "none";
	document.getElementById("settings").style.display = "none";
}

function showAll(){
	document.getElementById("summary").style.display = "block";
	document.getElementById("companies").style.display = "block";
	document.getElementById("trades").style.display = "block";
	document.getElementById("settings").style.display = "block";
}

function gotoSummary(){
	hideAll();
	document.getElementById("summary").style.display = "block";
}
function gotoCompanies(){
	hideAll();
	document.getElementById("companies").style.display = "block";
}
function gotoTrades(){
	hideAll();
	document.getElementById("trades").style.display = "block";
}
function gotoSettings(){
	hideAll();
	document.getElementById("settings").style.display = "block";
}

function invest(){
	var value = parseInt(document.getElementById("invAmmount").value);
	if(value > 0 && appData.cash > value){
		appData.trades.push({companyId : selectedCompany, ammount : value, price : appData.companies[selectedCompany].values[appData.companies[selectedCompany].values.length-1]});
		closeShownStock();
		appData.cash -= value;
		gotoTrades();
	}
}

function updateTrades(){
	var content = "<h3>Trades:</h3>";
	var currentInvVal = 0;
	var currentPL = 0;
	if(appData.trades.length > 0){
		for(var i = 0; i < appData.trades.length; i++){
			var plDisplay;
			var currentPLThis = appData.companies[appData.trades[i].companyId].values[appData.companies[appData.trades[i].companyId].values.length-1] - appData.trades[i].price;
			if(currentPLThis > 0) plDisplay = "<span style='float: right; color: lime' onclick='closeTrade(" +i+ ")'>P/L: $" +currentPLThis.toFixed(2)+ " [X]</span>";
			else plDisplay = "<span style='float: right; color: red' onclick='closeTrade(" +i+ ")'>P/L: $" +currentPLThis.toFixed(2)+ " [X]</span>";
			var currentInvValThis = appData.trades[i].ammount + currentPLThis;
			content += "<div class='blockList'>$" + appData.trades[i].ammount.toFixed(2) + " on " +appData.companies[appData.trades[i].companyId].name+ ".<br/>Bought at $" +appData.trades[i].price.toFixed(2)+ ". " +plDisplay+ "</span></div>";
			
			currentPL += currentPLThis;
			currentInvVal += currentInvValThis;
		}
		if(currentPL > 0) content += "<p align='right' style='color: lime'>Total Profits: " +currentPL.toFixed(2)+ "</p>";
		else content += "<p align='right' style='color: red'>Total Losses: " +currentPL.toFixed(2)+ "</p>";
		document.getElementById("trades").innerHTML = content + "<hr />";
		appData.currentPL = currentPL;
		appData.currentInvVal = currentInvVal;
	}else{
		appData.currentPL = 0;
		appData.currentInvVal = 0;
		document.getElementById("trades").innerHTML = content + "<p>No data</p></div><hr />";
	}
}

function updateSummary(){
	var moneyInvested = 0;
	if(appData.trades.length > 0){
		for(var i = 0; i < appData.trades.length; i++){
			moneyInvested += appData.trades[i].ammount;
		}
		appData.moneyInvested = moneyInvested;
	}
	var content = "<h3>Summary:</h3>";
	content += "<p>Cash: $" + appData.cash.toFixed(2) + "</p>";
	content += "<p>Money invested: $" +moneyInvested.toFixed(2)+ "</p>";
	var profitOrLoss;
	if(appData.currentPL > -0.01) profitOrLoss = " <span style='color: lime'>($" +appData.currentPL.toFixed(2)+ " profit)";
	else profitOrLoss = " <span style='color: red'>($" +appData.currentPL.toFixed(2)+ " loss)";
	content += "<p>Current investments value: $" +appData.currentInvVal.toFixed(2) + profitOrLoss + "</p>";
	document.getElementById("summary").innerHTML = content + "<hr />";
}

function smallerText(){
	if(appData.textSize > 10){
		appData.textSize -= 2;
		document.getElementsByTagName("body")[0].style.fontSize = appData.textSize + "px";
	}
}

function biggerText(){
	if(appData.textSize < 16){
		appData.textSize += 2;
		document.getElementsByTagName("body")[0].style.fontSize = appData.textSize + "px";
	}
}

function closeTrade(x){
	var currentPLThis = appData.companies[appData.trades[x].companyId].values[appData.companies[appData.trades[x].companyId].values.length-1] - appData.trades[x].price;
	var currentInvValThis = appData.trades[x].ammount + currentPLThis;
	appData.cash += currentInvValThis;
	appData.trades.splice(x, 1);
}