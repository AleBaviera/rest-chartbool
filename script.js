function init() {

    getDataServer();
}

function getLabelMonth(){

  var months = moment.months();
  console.log(months);
  return months;
}

function getDataSales(data){

  var monthProfit = new Array(12).fill(0);
  console.log(monthProfit);

  for (var i = 0; i < data.length; i++) {
    var d = data[i];
    var amount = d.amount;
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
    var amount = d.amount;



    if (!sellers[seller]) {

      sellers[seller] = 0;

    }

    console.log(sellers);
      sellers[seller] += amount;


    console.log(sellers);

  }
  return sellers;

}

function getDataServer(){

  $.ajax({
    url:'http://157.230.17.132:4010/sales',
    method:'GET',

    success: function(data){
      console.log(data);

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

      var sellers = getDataSeller(data);
      var nameSalesman = Object.keys(sellers);
      var amountSeller = Object.values(sellers);
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
