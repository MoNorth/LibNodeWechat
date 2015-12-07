# 基于nodejs express&wechat-node开发的西邮图书馆
我感觉我写东西和往常一模一样的,还没写完,"duang~",先贴出来,导致我舍友老是骂我,"你这不是坑人呢嘛!",怪我咯,上次写`wechat-node`时没有什么小伙伴,没人给我提交Bug,只能我自己用用感受感受Bug出在哪里了呀.实在悲剧.而这次的西邮图书馆也是一样,图书馆写过那么多那么多次了,毫无新意,写的也无聊,但起码实现了部分功能,还能凑合用用,主要是测试的我`wechat-node`嘛.不要介意.
## git地址
[https://github.com/MoNorth/LibNodeWechat.git](https://github.com/MoNorth/LibNodeWechat.git)
## 修正wechat-node
由于手残,导致了一些问题,这块也不多说,等到下一个新版本发布的时候,也就大白天下了.这个西邮图书馆也是在老版本的环境下编写了,但是修正了一点,就是在`wechat-node/module/use.js`文件中,作出了一下修正.将

```javascript
case 'session':
        {
            var session = require("./session");
            extend(wechat.prototype,session);
        }
```
改为

```javascript
case 'session':
        {
            var session = require("./session");
            extend(wechat,session);
        }
```
## 开始
### 依赖包配置

```bash
npm install express
npm install wechat-node
npm install request
npm install mongodb
npm install ejs
```
### 开法前开发
我比较喜欢将这个环节称呼为开法前的开发,因为这个是必须的,但不是每次都需要的.
#### 初始化app.js

```javascript
var express = require("express");
var app = express();
var wechat_node = require("wechat-node");
var wechat = new wechat_node(app,"YOUR APPID","YOUR SECRET","YOUR TOKEN");
/**
 * ...
 */
app.listen(8080);
```
#### 微信认证

```javascript
wechat.use("authentication");
```
#### 加载菜单
目录`node_moudles/wechat-node/moudle/menu.json`

```javascript
 {
   "button": [{
     "name": "我的借阅",
     "sub_button":[{
        "type":"click",
        "name":"历史借阅",
        "key":"history_book"
      },
      {
        "type":"click",
        "name":"我的收藏",
        "key":"fav_book"
      },
      {
        "type":"click",
        "name":"当前借阅",
        "key":"my_book"
      }]
   }, 
   {
     "name": "搜索图书",
     "type": "click",
     "key":"ser_book"
   },
   {
     "name":"关于我",
     "type":"view",
     "url":"http://north.gitcafe.io"
    }]
 }
```

```javascript
wechat.use("setMenu",callback);
```
ok,进行了前面这两项,运行一下,没问题,好了,可以注释掉了,他们的使命光荣完成了...这点还需手动,实属有些鸡肋,我的错...
### 基本回复
#### 文本回复
由于本项目目前不需要文本回复,所以忽略,随便回个什么意思一下.

```javascript
wechat.use("postData");
wechat.retext(function(ok,req,res,result) {
     res.sendText("暂时不能自动回复");
});
```
#### 由于肯定会用到session,所以加载session

```javascript
wechat.use("session");
```
#### 点击事件消息处理

```javascript
var myLib = require("./route/myLib");
wechat.reclick({
    "ser_book": require("./route/search"),
    "my_book" : myLib.my_book,
    "fav_book": myLib.fav_book,
    "history_book" : myLib.history_book
},"");
```
由于东西还比较多,我就稍微分了下文件,清楚的东西还是去github上看好了.

#### ser_book事件
由于查找书后点击详情要进行html页面加载,所以引入了`ejs`.

```javascript
app.set("view engine","ejs");
app.get("/book",require("./route/bookinfo"));
```

然后就可以在设置全文目录的时候直接指定地址了.

```javascript
var data = require("./newsData");
var makeNews = function(detail) {
    if(!detail)
    {
        return false;
    }
    var bookData = detail.BookData;
    if(!bookData)
    {
        return false;
    }
    var array = [];
    for(var i in bookData)
    {
        array.push(new data(bookData[i]["Title"],
                            bookData[i]["Author"],
                            bookData[i]["Images"] 
                            ? bookData[i]["Images"]["large"] 
                            || bookData[i]["Images"]["medium"] 
                            || bookData[i]["Images"]["small"]
                            : "https://gss0.bdstatic.com/5eR1dDebRNRTm2_p8IuM_a/res/img/logo/logo201509091.png",
                            "http://YOUR IP OR URL/book?id=" + bookData[i]["ID"]
            ));
    }
    return array;
}
```

#### my_book事件
这里用mongodb做了微信用户与校园用户的绑定,方便二次使用.

```javascript
var fristButClick = function(req,res,result,callback) {
    mongodb.select(result.fromusername,function(err,data) {
        if(!err)
        {
            if(data === 404)
            {
                res.sendText("请输入学号&密码.\n如 S04130000&123456");
                wechat.createSession(result,registered);
            }
            else
            {
                console.log(data);
                res.sendText("server error");
            }
        }
        else
        {
            callback(req,res,data);
        }
    });
}
```
### 填充其与函数
将之前所涉及的函数填充完成,改改bug,也就能跑了.很简单的一个小案列,结束.
## 结束
这时候说结束真的太过于匆忙,好像什么都没有说清,我的错我的错,有兴趣可以直接去看我github上的代码,我感觉直接看代码比听我讲要清楚地多.再次提一下我的博客和github地址.

博客地址:[north.gitcafe.io](http://north.gitcafe.io)

github:[github.com/MoNorth](http://github.com/MoNorth)

npm:[www.npmjs.com/~northk](https://www.npmjs.com/~northk)
