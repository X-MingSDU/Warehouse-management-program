

## A warehouse management WeChat small program 

> Based on WeChat developer tools and WeChat small program cloud development functions
>
> Code language: Html&CSS, Javascript
>
> Software used：Wechat developer tool，open the whole program is in the file '入库'. 



### Ⅰ. Functions

- Scan one-dimensional codes and two-dimensional codes and return the result

- Return the information of the product by scanning codes

- Put the goods into the warehouse and pass the name, price, and storage time of the goods into the database

- Use list to display information about the items in the warehouse and display the stock number

- Remove items from the warehouse to the recycle bin

- Pop up a window when the inventory is zero

- Manual input date to query the goods and quantity on a specific day

- Recycle bin can display outgoing record and outgoing quantity

- Click to empty recycle bin

  

### Ⅱ. Processes

### 2.1 Initial page 

#### 1、Scan one-dimensional codes and two-dimensional codes

- ```javascript
  /** Use the function :wx.scanCode({})
  * Click the button to trigger the event, pass parameters from callback functions and display parameters on the wxml page
  */
  getQRCode: function(){
      var _this = this;
      //1、scan
      wx.scanCode({        //use API
        success: function(res){
          console.log(res);
          var scanType = res.scanType;
          var charSet = res.charSet;  //return information
          var qRCodeMsg=res.result;
          //2、assign the value of parameters
          _this.setData({
            qRCodeMsg: res.result,
            scanType: scanType,
            charSet: charSet
          });
        }
      })
  }
  ```
  
  
  

#### 2、Identify the type of goods

- Saves the result of the barcode to the page parameters，upload the result to Aliyun api and return the information of the goods. (Api website：https://market.aliyun.com/products/56928004/cmapi011806.html?spm=5176.12901015.0.i12901015.488d525c0NjNQP#sku=yuncode580600005)

- ```javascript
  /** 
  * Use Aliyun api，return parameters
  * save the parameters and display them on the page
  */
  wx.request({
            url: 'https://jisutxmcx.market.alicloudapi.com/barcode2/query',
            method:'get',
            header:{ 
              'Authorization':'APPCODE 5b7aa2ff0ec64cc9bdced5855aaa5830',
              'content-type': 'application/json',
              'charset': 'utf-8',
            },
            data: { //upload
              barcode: qRCodeMsg, //number of the barcode
            }, 
      	//callback function
            success(res){        
              var RESULT=res.data;
              console.log(RESULT);
              var name=RESULT.result.name; // save the parameter
              var price=RESULT.result.price; // save the parameter
  			//setData
              _this.setData({
                RESULT:RESULT,
                name:name,
              price:price
              });
  ```
  

#### 3、Upload the information of goods to the cloud database

- Add records to the collection of the database

- The information includes the name , price, date of the goods

- Return the record id  from the database 

  ```javascript
   		const db = wx.cloud.database();
          //get the time
          var now=new Date();
          var date=now.getDate();
          var year = now.getFullYear();
          var month = now.getMonth() + 1;
          var hour = now.getHours(); //hour
          var minute = now.getMinutes(); //
          var second = now.getSeconds();
          var time=year+"年"+month+"月"+date+"日"+hour+"时"+minute+"分"+second+"秒";
          db.collection('warehouse').add({
          // data represents the Json data 
        data: {
            // _id: 'todo-identifiant-aleatoire', // you can input the _id by yourself
            name:name,
            time: time,
            price:price
          },
          success: function(res) {
            // res is an object,where '_id' represents the newly created id
            console.log(res._id),
            _this.setData({
              time:time
            })
            wx.showToast({
              title: '成功入库',
              duration: 1500
            });
          },
  ```

  


### 2.2 The warehouse page

#### 1、Display the first 20 goods(system default) in the warehouse

- Scrolling component

  ```javascript
   <scroll-view bindscrolltolower="lower" scroll-y="true" style="height: 100%">
   </scroll-view>
  <!--'lower' means the bottom of the page，'scroll-y' means the page can be scrolled up and down-->
    
  ```

- Visualize the information of the items in the database

  > Css code will be refered later
  
  ```html
  <view class="content_box" wx:for="{{house}}" wx:key="unique">
    	<!--'house' includes all the records in the database-->
            <view class="view_ce">
           
             <view class="content_box_center">
              <view class="view_content">
      <!--Display the information of each item-->
                  <view class='view_title'>{{item.name}}</view>
                  <view class="view_fl">
                    <text>{{item.price}}</text>
                    <text>{{item.time}}</text>
                  </view>
    <!--We can return the index of the item we are clicking by adding 'data-index'-->
                  <view class="delete_btn" bindtap='delete_btn' data-index="{{index}}">出库</view>
              </view>
            </view>
            </view>
          </view>
  ```

2、Display items in the database in the reverse order

> We can see the reverse() function in the '_proto'.Therefore, use the function 'house.reverse()' can reverse the list. 

#### 3、Remove the goods from the database

- ```htm
  <view class="delete_btn" bindtap='delete_btn' data-index="{{index}}">出库</view>
  ```

- ```javascript
  /** 'data-index' can pass the index from the front-end to the javascript file
  * return the index of item which is being clicked in the list
  * remove the goods from the database by its id
  * when removing the goods, upload the information of the goods to the 'out' collection in the database.
  */
  delete_btn:function(e){
      //var that = this;
      var now=new Date();
      var date=now.getDate();
      var year = now.getFullYear();
      var month = now.getMonth() + 1;
      var hour = now.getHours(); //小时
      var minute = now.getMinutes(); //分
      var second = now.getSeconds();
      var Time =year+"年"+month+"月"+date+"日"+hour+"时"+minute+"分"+second+"秒";
  
      var index = e.currentTarget.dataset.index;
      console.log(typeof(index));
      var ID = new Object();
      //get the index
      //delete the goods by its _id
      ID = this.data.house[index]._id;
      console.log(ID);
      const db = wx.cloud.database();
  
      //get the information of the goods that is going to be deleted,and send the information to the 'out' collection in the cloud database
      var ID = this.data.house[index]._id;
      var name = this.data.house[index].name;
      var time = this.data.house[index].time;
      var price = this.data.house[index].price;
  
      db.collection('out').add({
        // data 
        data: {
         //ID,name，price,time,Time
         ID :ID,
         name: name ,
         time: time, 
         Time: Time,
         price:price,
         done:false
  
        },
      });
      //remove from the original collection
      db.collection('warehouse').doc(ID).remove({
        success: function(res) {
          console.log(res.data);
          wx.showToast({
            title: '删除成功',
            duration: 1000
          })
        }
      })
    },
  ```

#### 4、Display the inventory and refresh the list

- ```javascript
  refresh:function(e){
      
      var _this=this;
      console.log(this.data.house.length);
      var count=this.data.house.length; //get the length
      _this.setData({
        count:count
      })
      
      this.onLoad(); //refresh the page
    },
  ```

#### 5、Remind you adding goods to the database when the inventory is zero

- see videos in the folder
- code snippets

```javascript
// put the conditional statement below in the 'refresh:function(e)'

if(count==0){
      wx.showToast({
        title: '库存为0请入库',
        duration: 1000
      });
    }
```

#### 6、Query entry record

- See videos in the folder

- ```html
  <!--wxml codes--> 
  <!--Employ the 'form' component--> 
  
  <form bindsubmit="getmonth">
       <input name="input" type="text" value='' placeholder="请输入查询日期，格式如7月5日"/>
       <button form-type="submit">查询</button>
 </form>
  ```
  
- ``` javascript
   getmonth:function(e){
      var that=this;
      var val=e.detail.value.input; //save the number from the front-end
      console.log(val);
      that.setData({
        date:val //save the variable 
      })
    },
    onLoad: function (options) {  
      var result=this.data.date;
      console.log(result);
      console.log(typeof(result));
      db.collection('warehouse').where({ //Find the conditions that match the input date
          time:result  
      })
      .get({
          success: function(res) {
            house=res.data;   
           that.setData({
            house:house, //get the variable needed and display it on the wxml page
          }）
         }
      })
    }
  ```

#### 7、Part of the CSS codes is quoted from the blog below：

https://blog.csdn.net/qq_39650528/article/details/80021765



### Ⅲ. The recycle bin

#### 1、What the recycle bin displays?

The code snippets of the page is similar to the pages that have been refered 

- Display the time, price, name of the goods in the page
- You can empty the recycle bin whenever you want

#### 2、Principle of the way that the recycle bin works

- Create a new collection in the database, save the time timely when deleting an item from the database, and then send the information of the deleted item to the 'out' collection.  
- Therefore, display the items in the 'out' collection and we will see what we have deleted.
- The principle of deleting an item is the same as adding an item. 

#### 3、Click the button to empty the recycle bin

- In nature, emptying the recycle bin is equivalent to deleting a collection of the database.

- We can delete the whole collection by employing cloud function

  > We can create a new cloud function named 'delete'，below is the 'index.js' in the funciton file 

  ```javascript
  const cloud = require('wx-server-sdk')
  cloud.init({
    env: 'firsttest-n27bb'//the name of the environment
  })
  const db = cloud.database()
  exports.main = async (event, context) => {
    try {
      return await db.collection('out').where({ 
          //When we delete the information of the goods from the database,we need to add the attribute named 'done' to each item,so that we can delete the collection easily 
        done:false
      }).remove()
    } catch(e) {
      console.error(e)
    }
  }
  ```

  > js in the small program 

  ```javascript
   wx.cloud.callFunction({
       name:'delete',
       success(res){
         console.log(res)
       },
       fail(res){
        console.log(res)
      }
  ```

> Attention: the cloud function in the 'app.js' need to be initialized,  the path of the cloud function should be added to 'project.config.json', the javascript file in the cloud function should be reuploaded every time you modify it.



### Ⅳ. Development direction

- Extract the time whenever an item is added or deleted to the database, and draw a graph to reflect the frequency.



### Ⅴ. Conclusion

- I spent about one week to finish the program by myself, all the references are marked in the article. The codes in the program have been debugged and optimized many times. As for me, my programming ability and logical thinking ability have been improved after finishing the program.
- The program employed cloud function and cloud database, called API, realized the interaction between the front-end and back-end. I learned a lot from it.