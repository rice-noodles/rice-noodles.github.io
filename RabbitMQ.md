## 消息队列

### 概述

1. 大多数应用中，可以通过消息服务中间件来提升系统异步通信、扩展解耦能力。

2. 消息服务中两个重要概念：

   + 消息代理（*message broken*）和目的地（*destination*）。
   + 当消息发送者发送消息以后，将由消息代理接管，消息代理保证消息传递到指定目的地。

3. 消息队列主要有两种形式的目的地

   + **队列（*queue*）：点对点消息通信（*point-to-point*）**

     消息发送者发送消息，消息代理将其放入一个队列中，消息接收者从队列中获取消息内容，消息读取后被移出队列。消息只有唯一的发送者和接受者，但并不是说只能有一个接收者。

   + **主题（*topic*）：发布（*publish*）/订阅（*subscribe*）消息通信。**

     发送者（发布者）发送消息到主题，多个接收者（订阅者）监听（订阅）这个主题，那么就会在消息到达时同时收到消息。

   + ***JMS*（*Java Message Service*）*Java*消息服务**：基于 *JVM* 消息代理的规范。*ActiveMQ*、*HornetMQ* 是 *JMS* 实现。

   + ***AMQP*（*Advanced Message Queuing Protocol*）**

     高级消息队列协议，也是一个消息代理的规范，兼容 *JMS*。*RabbitMQ* 是 *AMQP* 的实现。

### 核心

> 解耦，异步，削峰

+ 解耦：生产端和消费端不需要相互依赖。
+ 异步：生产端不需要等待消费端响应，直接返回，提高了响应时间和吞吐量。
+ 削峰：打平高峰期的流量，消费端可以以自己的速度处理，同时也无需在高峰期增加太多资源，提高资源利用率，提高消费端性能。消费端可以利用buffer等机制，做批量处理，提高效率。

## RabbitMQ

> RabbitMQ是一个由erlang开发的AMQP的开源实现

 ![img](https://img-blog.csdnimg.cn/20190610225910220.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2thdml0bw==,size_16,color_FFFFFF,t_70) 

### 核心概念

#### Message

消息，消息是不具名的，它由消息头和消息体组成。消息体是不透明的，消息头则由一系列的可选属性组成。

消息头属性包括 *routing-key*（路由键）、*priority*（相对于其他消息的优先权）、*delivery-mode*（指出该消息可能需要持久性存储）等。

#### Publisher
消息的生产者，也是一个向交换器发布消息的客户端应用程序。

#### Channel

信道，多路复用连接中的一条独立的双向数据流通道。

信道是建立在真实的 *TCP* 连接内的虚拟连接，*AMQP* 命令都是通过信道发出去的，不管是发布消息，订阅队列还是接收消息，这些动作都是通过信道完成。

因为对于操作系统来说建立和销毁 *TCP* 都是非常昂贵的开销，所以引入了信道的概念，以复用一条 *TCP* 连接。

#### Exchange

交换器，用来接收生产者发送的消息并将这些消息路由给服务器中的队列。

*Exchange* 有四种类型：*direct*（默认），*fanout*，*topic* 和 *headers*，不同类型的 *Exchange* 转发消息的策略有所区别。

+ **direct：**路由键与队列名完全匹配。消息中的路由键（routing-key）如果和 *Binding* 中的 *binding-key* 一致，交换器就会将消息发送到对应的队列中。该类型是完全匹配、单播的模式。
+ **fanout：**不处理键值，每个 *fanout* 类型交换器的消息都会分到所有绑定的队列上去。是最快的转发消息类型。
+ **topic：**通过模式匹配分配消息的路由键值属性，将路由键和某个模式进行匹配，此时队列需要绑定到一个模式上。它将路由键和绑定键的字符串切分成单词，这些单词之间用点隔开。它同样也会识别两个通配符  **#** 和 *****，**#** 匹配零或多个单词，***** 匹配一个单词。
+ **header：**匹配消息的 *header* 与 *direct* 交换器一致，但是性能差很多。不建议使用。

#### Queue

消息队列，用于保存消息直接发送给消费者。它是消息的容器，也是消息的终点。

一个消息可投入一个或多个队列。消息一直在队列里面，等待消费者连接到这个队列将其取走。

#### Consumer

消息的消费者，表视从消息队列中取得消息的客户端应用程序。

#### Binding

绑定，用于消息队列和交换器之间的关联。

一个绑定就是基于路由键将交换器和消息队列连起来的路由规则，所以可以将交换器理解成一个由绑定构成的路由表。*Exchange* 和 *Queue* 的绑定可以是多对多的关系。

#### Connection

网络连接，比如一个 *TCP* 连接。

#### Virtual Host

虚拟主机，表视一批交换器、消息队列和相关对象。

虚拟主机是共享相同的身份认证和加密环境的独立服务器域。每个 *vhost* 本质上就是一个 *mini* 版的 *RabbitMQ* 服务器，拥有自己的队列、交换器、绑定和权限机制。*vhost* 是 *AMQP* 概念的基础，必须在连接时指定，*RabbitMQ* 默认的 *vhost* 是 /。

#### Broker

 消息队列服务进程，此进程包括两个部分：*Exchange* 和 *Queue* 。

### 工作流程

#### 生产者发送消息流程

1. 生产者和 *Broker* 建立 *TCP* 连接。
2. 生产者和 *Broker* 建立 *Channel*（信道）。
3. 生产者通过通道消息发送给 *Broker*，由 *Exchange* 将消息进行转发。
4. *Exchange* 将消息转发到指定的 *Queue*（队列）。

#### 消费者接收消息流程

1. 消费者和 *Broker* 建立 *TCP* 连接。

2. 消费者和 *Broker* 建立通道。

3. 消费者监听指定的 *Queue*（队列）。

4. 当有消息到达 *Queue* 时 *Broker* 默认将消息推送给消费者。

5. 消费者接收到消息。

6. *ack* 回复。

   为了确认消费者已经收到了消息。*RabbitMQ* 设计了一个 *ACK* 机制。当消费者获取消息后，会向 *RabbitMQ* 发送回执 *ACK*，告知消息已经被接收。不过这种回执 *ACK* 分两种情况：

   + **自动ACK：**消息一旦被接收，消费者自动发送 *ACK*。
   + **手动ACK：**消息接收后，不会发送 *ACK*，需要手动调用。

### 运行机制

![1595222882798](C:\Users\huhan\AppData\Roaming\Typora\typora-user-images\1595222882798.png)



> [消息队列]( https://www.cnblogs.com/wanlei/p/10650325.html )
>
> [RabbitMQ快速入门](https://blog.csdn.net/kavito/article/details/91403659?utm_medium=distribute.wap_relevant.none-task-blog-BlogCommendFromMachineLearnPai2-1.nonecase&depth_1-utm_source=distribute.wap_relevant.none-task-blog-BlogCommendFromMachineLearnPai2-1.nonecase)

