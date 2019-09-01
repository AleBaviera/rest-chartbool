function init() {

    getDataServer();
    $('#addSale').click(addSale);
    // postDataServer();
}

function getLabelMonth(){

  var months = moment.months();
  console.log(months);
  return months;
}

function add(a,b){
  return a+b;
}

function getDataSales(data){

  var monthProfit = new Array(12).fill(0);
  console.log(monthProfit);

  for (var i = 0; i < data.length; i++) {
    var d = data[i];
    var amount = Number(d.amount);
    var monthSales = d.date;
    var month = moment(monthSales, 'DD/MM/YYYY').month();
    console.log(month);
    console.log(monthSales);


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

    console.log(sellers);
      sellers[seller] += amount;


    console.log(sellers);

  }
  return sellers;

}

function selSeller(data){
  var sellers = Object.keys(getDataSeller(data));
  console.log(sellers);
  for (var i = 0; i < sellers.length; i++) {
      $("#selSeller").append($('<option>', {
    value: sellers[i],
    text: sellers[i]
      }));
  }
}

function selMonth(data){
  var months = getLabelMonth();
  console.log(months);
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
  console.log(monthSales, months);
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

function addSale(){

  var selectedSeller = $('#selSeller').val();
  console.log(selectedSeller);
  var selectedMonth = $('#selMonth').val();
  console.log(selectedMonth);
  var newAmount = Number($('input').val()); // restituisce un numero
  console.log(newAmount);




  var month = moment().month(selectedMonth).format('MM');
  console.log(month);

  $.ajax({
    url:'http://157.230.17.132:4010/sales',
    method:'POST',
    data: {
      amount : Number(newAmount), //restituisce una stringa!!
      salesman : selectedSeller,
      date : '01/' + month + '/2017'
    },
    success: function(data){
      console.log('postato', data);
       // getDataServer();

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
      console.log(data);

      printLineChart(data);
      printPieChart(data);
      selSeller(data);
      selMonth(data);





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
