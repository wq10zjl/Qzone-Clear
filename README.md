
#Qzone Clear#

## 目录 ##
1. [简介](#intro)
2. [主要功能](#features)
3. [安装](#install)
4. [使用方法](#use)
5. [近期更新](#update)

<a name="intro"></a>
## 一、简介 ##

**在QQ空间上屏蔽不想看到的好友动态。**  

![](http://i.imgur.com/r3Y29Ds.jpg)

<a name="features"></a>
## 二、主要功能 ##
- 根据输入的 **QQ号** 屏蔽相关的动态。
- 根据输入的 **备注名称** 屏蔽相关的动态。
- 根据输入的 **关键词** 屏蔽相关的动态。
- 备份屏蔽设置。

#### 当前能屏蔽的内容 ####
1. 指定 QQ 用户的说说。
2. 指定 QQ 用户在他人说说下的评论。
3. 指定 QQ 用户点的「赞」。
4. 指定 QQ 用户被转发的说说。
5. 含有指定关键字的说说。

<a name="install"></a>
## 三、安装 ##
初版尚未提交 Chrome Webstore，请在 **Chrome 浏览器设置--扩展程序下拖入 [Qzone Clear.crx](https://github.com/idiotWu/Qzone-Clear/blob/master/Qzone%20Clear.crx?raw=true) 文件** 进行安装。

<a name="use"></a>
## 四、使用方法 ##
1. 在 QQ 空间点击地址栏的![](http://i.imgur.com/5NxkBXZ.jpg)图标，输入想要屏蔽的用户/关键字。多关键字请用 + 隔开，当移除目标**同时存在有所有关键字**时，其将被移除。

2. 在QQ空间内容页内，鼠标指向QQ用户头像，在弹出的资料卡片上点击「屏蔽」（**鼠标移入资料卡片才会出现**）。  
![](http://i.imgur.com/IzPrbwB.jpg)

3. 拓展选项：通过设置选项可以达到部分屏蔽的目的；通过授权获取好友信息可以获得**输入联想功能**！（类似于@用户时出现的候选列表）。  
![](http://i.imgur.com/PheRJ7O.jpg)  
![](http://i.imgur.com/0e25lRf.jpg)

4. 备份功能：使用 chrome.storage.sync 来进行备份，当且仅当 **chrome 登录有账户且在联网状态下** 可以进行账户内云同步。  
![](http://i.imgur.com/E6gAMck.jpg)


**使用插件时有可能会出现「网络出了点小问题，立即修复」，慎点！，点击后 DOM 结构将被改变，插件将失效。彼时请在插件选项中打开「兼容性开关」！**


<a name="update"></a>
## 五、近期更新 ##
#### v0.3.3 ####
- 页面增加显示屏蔽对象的功能  
![](http://i.imgur.com/WZB3QzW.jpg)

#### v0.3.2 ####
- 将页面屏蔽入口移至名片内
- 添加自动获取**非好友**昵称功能  
![](http://i.imgur.com/yaHqn83.png)

#### v0.3.0 ####
- 增加输入数据记忆
- 页面上增加屏蔽入口
- 增加获取好友数据功能，增强易用性  
PS：**获取好友数据行为并不会自发发生，所以不能实时更新好友数据。**  

#### v0.2.1 ####
- 增加选项设置图示。  
- 增加**兼容性开关**，当用户误点了「网络出了点小问题，立即修复」，可使用该选项恢复插件功能。  

#### v0.2.0 ####
- 增加「根据赞的数量移除说说」。
- 增加屏蔽签到内容。  

#### v0.1.7 ####
- 增加屏蔽选项设置。  

#### v0.1.2 ####
- 修复当输入内容为“数字 + 字符串”时，错误分组到QQ号码。
- 修复多个关键字相同时错误删除对象。
- 增加过渡效果。
- 增加备份 / 还原功能：

#### v0.1.1 ####
- 增加多关键字屏蔽。使用方法：用 **+** 号隔开多个关键字即可。
