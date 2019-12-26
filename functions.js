async function insertSellOrder(mysqlConnection,q)
{
  mysqlConnection.query(q,(err,res)=>{
    if(err) console.log(err);
    if(res) console.log('sellOrders database updated');
  });
}

async function insertBuyOrder(mysqlConnection,q)
{
  mysqlConnection.query(q,(err,res)=>{

  if(err) console.log(err);
  if(res) console.log('buyOrder inserted');
  });
}


async function sellOrdersMatching(amount,mysqlConnection,orderbookId){
  mysqlConnection.query("SELECT min(price) as minPrice FROM sellOrders WHERE asset1_amount="+amount+" and status='LIVE'",(err,data)=>{
    if(err) console.log(err);

    mysqlConnection.query("SELECT min(id) as minId from sellOrders WHERE price="+data[0].minPrice,(err1,data1)=>{
      if(err1) console.log(err1);

      mysqlConnection.query("UPDATE sellOrders SET status='TRADED' WHERE id="+data1[0].minId,(err2)=>{
      if(err2) console.log(err2);
      console.log('sellOrders updated id '+data1[0].minId+' from LIVE to TRADED');
      });

      mysqlConnection.query("SELECT * FROM sellOrders WHERE id="+data1[0].minId,(err3,data2)=>{
        if(err3) console.log(err3);
        mysqlConnection.query("INSERT INTO orderbook(id,sellAdress,price) VALUES("+orderbookId+",'"+data2[0].name+"',"+data2[0].price+")",
        (err4)=>{
          if(err4) console.log(err4);
        });

      });

     });
  });



}


async function tradedBuyIdUpdate(mysqlConnection,buy_id){
  var q = "UPDATE buyOrders SET status='TRADED' WHERE id="+buy_id;
  mysqlConnection.query(q,(err,res)=>{

  if(err) console.log(err);
  if(res) console.log('buyOrders Updated');
  });

}


async function orderBookUpdate(mysqlConnection,orderbookId)
{

  var q="SELECT * from buyorders WHERE status='TRADED'";
  mysqlConnection.query(q,(err,res)=>{
    if(err) console.log(err);
    var len=res.length;
    var i;
    for(i=0;i<len;i++)
    {
        orderbookId++;
        var q1="INSERT INTO order_book VALUES("+orderbookId+",'"+res[i]['asset1']+"','"+res[i]['asset2']+"',"+res[i]['asset1_amount']+","+res[i]['price']+")";
        console.log(q1);
        mysqlConnection.query(q1,(err)=>{
          if(err) console.log(err);
        });
    }

  });

  var q="SELECT * from sellorders WHERE status='TRADED'";

  mysqlConnection.query(q,(err,res)=>{
    if(err) console.log(err);
    var len=res.length;
    var i;
    for(i=0;i<len;i++)
    {
        orderbookId++;
        var q1="INSERT INTO order_book VALUES("+orderbookId+",'"+res[i]['asset1']+"','"+res[i]['asset2']+"',"+res[i]['asset1_amount']+","+res[i]['price']+")";
          console.log(q1);
        mysqlConnection.query(q1,(err)=>{
          if(err) console.log(err);
        });
    }

  })
}





// sellOrdersMatching(3,mysqlConnection,2)

module.exports.sellOrdersMatching = sellOrdersMatching;
module.exports.tradedBuyIdUpdate = tradedBuyIdUpdate;
module.exports.insertBuyOrder = insertBuyOrder;
module.exports.insertSellOrder = insertSellOrder;
module.exports.orderBookUpdate = orderBookUpdate;
