function init() {

    getDataServer();
    $('#addSale').click(addSale);

}

function getLabelMonth(){

  var months = moment.months();
  return months;
}

function add(a,b){
  return a+b;
}

function getDataSales(data){

  var monthProfit = new Array(12).fill(0);

  for (var i = 0; i < data.length; i++) {
    var d = data[i];
    var amount = Number(d.amount);
    var monthSales = d.date;
    var month = moment(monthSales, 'DD/MM/YYYY').month();

    monthProfit[month]+= amount;
  }
  return monthProfit;
}


function getDataSeller(data){

  var sellers = {};

  for (var i = 0; i < data.length; i++) {
    var d = data[i];
    var seller = d.salesman;
    var amount = Number(d.amount);

    if (!sellers[seller]) {
      sellers[seller] = 0;
    }

    sellers[seller] += amount;
  }
  return sellers;

}

function selSeller(data){
  var sellers = Object.keys(getDataSeller(data));
  for (var i = 0; i < sellers.length; i++) {
      $("#selSeller").append($('<option>', {
        value: sellers[i],
        text: sellers[i]
      }));
  }
}

function selMonth(data){
  var months = getLabelMonth();
  for (var i = 0; i < months.length; i++) {
      $("#selMonth").append($('<option>', {
        value: months[i],
        text: months[i]
      }));
  }
}

function printLineChart(data){
  var monthSales = getDataSales(data);
  var months = getLabelMonth();
  var ctx = document.getElementById('myChart').getContext('2d');
  var myChart = new Chart(ctx, {
      type: 'line',
      data: {
          labels: months,
          datasets: [{
              label: '# Sales',
              data: monthSales,
          }]
      },

  });
}

function printPieChart(data){
  var sellers = getDataSeller(data);
  var nameSalesman = Object.keys(sellers);
  var amountSeller = Object.values(sellers);

  //calcolo i valori in %

  var totAmount = amountSeller.reduce(add);
  console.log(totAmount);
  for (var i = 0; i < amountSeller.length; i++) {
    amountSeller[i] = Math.floor((amountSeller[i]/totAmount)*100);
  }
  console.log(amountSeller);
  var ctxDoughnut = document.getElementById('myChartDoughnut').getContext('2d');
  var myChartDoughnut = new Chart(ctxDoughnut, {
      type: 'doughnut',
      data: {
          labels: nameSalesman,
          datasets: [{
              label: '# Sales',
              data: amountSeller,


          }]
      },

  });
}
function getDataQuarter(data){
  console.log(data);


  var dataQuarter = {
    Q1 : 0,
    Q2 : 0,
    Q3 : 0,
    Q4 : 0
  };

  for (var i = 0; i < data.length; i++) {
      var d = data[i];
      var month = Number(moment(d.date).month());
      var amount = Number(d.amount);

      if (month < 2) {
        dataQuarter['Q1']+= amount;
      } else if (month < 5){
        dataQuarter['Q2']+= amount;
      }else if (month < 8){
        dataQuarter['Q3']+= amount;
      }else {
        dataQuarter['Q4']+= amount;
      }

  }
  console.log(dataQuarter);
  return dataQuarter;
}

function printBarChart(data){
  var dataQuarter = Object.values(getDataQuarter(data));
  console.log(dataQuarter);
  var ctxDoughnut = document.getElementById('myChartBar').getContext('2d');
  var myChartDoughnut = new Chart(ctxDoughnut, {
      type: 'bar',
      data: {
          labels: ['quarter1','quarter2', 'quarter3', 'quarter4'],
          datasets: [{
              label: '# Sales',
              data: dataQuarter,


          }]
      },

  });
}

function addSale(){

  var selectedSeller = $('#selSeller').val();
  console.log(selectedSeller);
  var selectedMonth = $('#selMonth').val();
  console.log(selectedMonth);
  var newAmount = Number($('input').val());
  console.log(newAmount);




  var month = moment().month(selectedMonth).format('MM');
  console.log(month);

  $.ajax({
    url:'http://157.230.17.132:4010/sales',
    method:'POST',
    data: {
      amount : Number(newAmount),
      salesman : selectedSeller,
      date : '01/' + month + '/2017'
    },
    success: function(data){
      console.log('postato', data);
      getDataServer();

    },
    error: function(){
      alert('errore');
    },
  });
  $('input').val('');

}

function getDataServer(){

  $.ajax({
    url:'http://157.230.17.132:4010/sales',
    method:'GET',

    success: function(data){

      for (var i = 0; i < data.length; i++) {
        var date = data[i].date.split('/');
        data[i].date = date[2] + '-' + date[1] + '-' + date[0];
        data[i].amount = Number(data[i].amount);
      }

      printLineChart(data);
      printPieChart(data);
      selSeller(data);
      selMonth(data);
      printBarChart(data);
    },
    error: function(){
      alert('errore');
    },
  });


}


// function getDataChart(){
//   var labels = getLabelMonth();
//
//   var ctx = document.getElementById('myChart').getContext('2d');
//   var myChart = new Chart(ctx, {
//       type: 'bar',
//       data: {
//           labels: labels,
//           datasets: [{
//               label: '# of Votes',
//               data: [],
//               backgroundColor: [
//                   'rgba(255, 99, 132, 0.2)',
//                   'rgba(54, 162, 235, 0.2)',
//                   'rgba(255, 206, 86, 0.2)',
//                   'rgba(75, 192, 192, 0.2)',
//                   'rgba(153, 102, 255, 0.2)',
//                   'rgba(255, 159, 64, 0.2)'
//               ],
//               borderColor: [
//                   'rgba(255, 99, 132, 1)',
//                   'rgba(54, 162, 235, 1)',
//                   'rgba(255, 206, 86, 1)',
//                   'rgba(75, 192, 192, 1)',
//                   'rgba(153, 102, 255, 1)',
//                   'rgba(255, 159, 64, 1)'
//               ],
//               borderWidth: 1
//           }]
//       },
//       options: {
//           scales: {
//               yAxes: [{
//                   ticks: {
//                       beginAtZero: true
//                   }
//               }]
//           }
//       }
//   });
//
// }
$(document).ready(init);
