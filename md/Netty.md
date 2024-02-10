I/O 模型

> I/O 模型：采用什么样的通道进行数据的发送和接收，很大程度上决定了程序通信的功能。

+ java 共支持三种网络编程 I/O 模式：BIO，NIO，AIO。

## BIO（同步阻塞）

> BIO 是 java 的原生 I/O 模型，其相关的类和接口在 java.io 中。

### 实现模式

一个线程处理一个请求，即每当收到一个请求时服务器端就需要启动一个线程对该请求进行处理，如果这个连接不做任何事情会造成不必要的线程开销。

### 工作流程

1. 服务器端启动一个 ServerSocket。
2. 客户端启动 Socket 对服务器进行通信，默认情况下服务器端需要对每个客户建立一个线程与之通讯。
3. 客户端发出请求后，先咨询服务器是否有线程响应，如果没有则会等待，或者被拒绝。
4. 如果有响应，客户端线程会等待请求结束后，再继续执行。

**BIO 实现网络通信实例**

~~~java
package com.noodles.bio;

import java.io.IOException;
import java.io.InputStream;
import java.net.ServerSocket;
import java.net.Socket;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class BIODemo {
    public static void main(String[] args) throws IOException {
        // 创建一个线程池，当有客户端连接，就创建一个线程
        ExecutorService newCachedThreadPool = Executors.newCachedThreadPool();
        ServerSocket serverSocket = new ServerSocket(6666);
        System.out.println("服务器启动了");
        while (true) {
            // 监听，等待客户端连接
            final Socket socket = serverSocket.accept();
            System.out.println("连接到一个客户端");
            newCachedThreadPool.execute(new Runnable() {
                public void run() {
                    handler(socket);
                }
            });
        }
    }

    public static void handler(Socket socket) {
        try {
            System.out.println("当前线程id：" + Thread.currentThread().getId());
            byte[] bytes = new byte[1024];
            InputStream inputStream = socket.getInputStream();
            while (true) {
                int read = inputStream.read(bytes);
                if (read != -1) {
                    System.out.println("当前线程id：" + Thread.currentThread().getId());
                    System.out.println(new String(bytes, 0, read));
                } else {
                    break;
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            System.out.println("关闭和client的连接");
            try {
                socket.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }
}
~~~

## NIO（同步非阻塞）

> NIO 相关类都放在 java.nio 中，并对原 java.io 包中的很多类进行改写。
>
> NIO 是面向缓冲区，或者是面向块编程的。它将数据数据读取到一个缓冲区，在需要数据时可在缓冲区中前后移动，增加了处理过程中的灵活性，使用它可以提供非阻塞式的高伸缩性网络。
>
> NIO 采用 reactor 的模式

### 实现模式

一个线程处理多个请求，即客户端发送的请求都会注册到多路复用器上，多路复用器轮询到连接有 I/O 请求就进行处理

![1590809927417](C:\Users\huhan\AppData\Roaming\Typora\typora-user-images\1590809927417.png)

### NIO三大核心

> Channel，Buffer，Selector

#### Channel（通道）

> Channel 是 NIO 中的一个接口

**常用的 Channel 类**

+ *FileChannel*：主要用来对本地文件进行 I/O 操作
+ *DatagramChannel*
+ *ServerSocketChannel*： 主要用于生成 *SocketChannel* 用于建立与客户端的连接
+ *SocketChannel*：可以通过 *ServerSocketChannel* 获得 *SocketChannel*；主要用于对数据的读写（通信）

**NIO 的 Channel 与流的区别**

+ *Channel* 可以同时进行读写，而流只能读或者写
+ *Channel* 可以实现异步读写数据
+ *Channel* 可以从缓冲读数据，也可以写数据到缓冲

~~~ mermaid
graph LR 
channel(Channel)==read==>buffer(Buffer)
buffer==>channel
~~~

**采用读取数据的方法复制文件**

![1590826464386](C:\Users\huhan\AppData\Roaming\Typora\typora-user-images\1590826464386.png)

**实现代码**

~~~java
package com.noodles.nio;

import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.Buffer;
import java.nio.ByteBuffer;
import java.nio.channels.FileChannel;

public class NIODemo {
    public static void main(String[] args) throws IOException {
        FileInputStream fileInputStream = new FileInputStream("in.txt");
        FileChannel inputChannel = fileInputStream.getChannel();

        FileOutputStream fileOutputStream = new FileOutputStream("out.txt");
        FileChannel outputChannel = fileOutputStream.getChannel();

        ByteBuffer buffer = ByteBuffer.allocate(512);

        while (true) {
            // 将从 in.txt 读取到的数据读入 byteBuffer 缓冲区中
            int read = inputChannel.read(buffer);
            buffer.flip();    // 由读转换成写
            // 将缓冲区的数据写入文件 out.txt
            outputChannel.write(buffer);
            /** 数据被读完之后要注意清空数据，将数据元素信息归位
            public final Buffer clear() {
                position = 0;
                limit = capacity;
                mark = -1;
                return this;
            }*/
            buffer.clear();
            if(read == -1) {
                break;
            }
        }
        fileInputStream.close();
        fileOutputStream.close();
    }
}
~~~



#### Buffer（缓冲区）

**简单介绍**

缓冲区本质上是一个可以读写数据的内存块，可以理解成是一个容器对象（含数组），该对象提供了一组方法，可以更轻松地使用内存块，缓冲区对象内置了一些属性，能够跟踪和记录缓冲区的状态变化情况。

Channel 提供从文件、网络读取数据的渠道，但是读取或写入的数据都必须经由 Buffer。

~~~ mermaid
graph LR 
nio(NIO程序)==data===buffer[缓冲区]
buffer==Channel===doc((文件))
~~~

**表示缓冲区中数据信息的四个属性**

+ *Capacity*：容量，既可以容纳的最大数量；在创建缓冲区时被设定，并且不能被改变

+ *Limit*：表示缓冲区的当前终点，不能对缓冲区超过极限的位置进行读写操作。*Limit* 是可以改变的

+ *Position*：位置，下一个要被读或写的元素的索引，每次读写缓冲区数据时都会改值，为下次读写做准备

+ *Mark*：标记

  

#### Buffer 与 Channel 的注意事项

1. *ByteBuffer* 支持类型化的 put 和 get。即从缓冲区中取出的数据的数据类型要与放入时的数据的数据类型一致。

2. 可以使用 *asReadOnlyBuffer()* 方法将 Buffer 转成只读 Buffer。

3. NIO 提供的 MappedByteBuffer 可以让文件直接在内存（堆外内存）进行修改，而如何同步到文件由 NIO 来完成。

4. NIO 还支持通过 Buffer 数组完成读写操作，即 Scattering 和 Gathering

   

#### Selector（选择器）

多个 Channel 是以事件的方式注册到同一个Selector中的。Selector 能够检测多个注册的通道上是否有事件发生，如果有事件，则获取事件，然后作出相应的处理。

**selector中的重要方法**

~~~ java
selector.select();	// 该方法是阻塞的

selector.select(1000);	// 阻塞 1000 毫秒，1000 毫秒之后返回

selector.wakeup();	// 唤醒 selector

selector.selectNow();	// 不阻塞，马上返回
~~~

**SelectiSonKey**

> SelectionKey 表示 Selector 与网络通道的注册关系，共有以下四种

~~~
int OP_ACCEPT	// 代表有新的网络连接可以 accept，值为 16

int OP_CONNECT	// 代表连接已经建立，值为 8

int OP_READ	// 代表读操作，值为 1

int OP_WRITE	// 代表写操作，值为 4

// 源码中的表示
public static final int OP_READ = 1 << 0;
public static final int OP_WRITE = 1 << 2;
public static final int OP_CONNECT = 1 << 3;
public static final int OP_ACCEPT = 1 << 4;
~~~



#### Channel，Buffer，Selector的关系

1. 每个 *Channel* 都会对应一个 *Buffer*
2. *Selector* 对应一个线程，一个线程对应多个 *Channel*
3. 程序切换到哪个 *Channel* 是由事件决定的，Event 就是一个重要的概念
4. *Selector* 会根据不同的事件，在各个通道上切换
5. *Buffer* 就是一个内存块，底层有一个数组
6. 数据的读取写入通过 *Buffer*，这个和 BIO 不同，BIO 中要么是输入流，或者是输出流，不能双向，但是 NIO 的 *Buffer* 是可以读也可以写的，需要 flip() 切换
7. *Channel* 是双向的，可以返回底层操作系统的情况，比如 Linux，底层的操作系统通道就是双向的



### NIO 非阻塞网络编程原理

1. 获取 *Selector* 和 *Channel* （*SocketChannel* 或 *ServerSocketChannel*）

2. *Channel* 绑定端口号，设置非阻塞，并注册 *Selector*，绑定 *SelectionKey* 的事件；一个 *Selector* 上可以注册多个 *Channel* 

3. *Selector* 使用相关的方法监听事件

4. 若有事件发生，通过 *Selector* 获得相关的事件（*SelectionKey* 的集合）

5. 判断监听到的事件的类型（*SelectionKey* 中的四种事件），并作出相应的处理

   

### *BIO* 与 *NIO* 的区别

1. *BIO* 以流的方式处理数据，而 *NIO* 以块的方式处理数据，块 *I/O* 的效率比流 *I/O* 高很多
2. *BIO* 是阻塞的，*NIO* 则是非阻塞的
3. *BIO* 基于字节流和字符流进行操作，而 *NIO* 基于 *Channel* 和 *Buffer* 进行操作，数据总是从通道读取到缓冲区中，或者从缓冲区写入到通道中。*Selector* 用于监听多个通道的事件（比如：连接请求，数据到达等），因此使用单个线程就可以监听多个客户端通道。



### 零拷贝

零拷贝是从操作系统的角度来说的。在内核缓冲区之间，没有数据是重复的（只有 *kernel buffer* 有一份数据）

零拷贝不仅仅带来更少的数据复制，还能带来其他的性能优势，例如更少的上下文切换，更少的 *CPU* 缓存伪共享以及无 *CPU* 校验和计算。

#### *mmap* 和 *sendFile*区别

1. *mmap* 适合小数据量的读写，*sendFile* 适合大文件传输。
2. *mmap* 需要 4 次上下文切换，3 次数据拷贝；*sendFile* 需要 3 次上下文切换，最少两次数据拷贝。
3. *sendFile* 可以利用 *DMA* 方式，减少 *CPU* 拷贝，*mmap* 则不能（必须从内核拷贝到 *Socket* 缓冲区）

#### *NIO*实现零拷贝

使用 *transferTo()*



## *AIO*（异步非阻塞）

> *AIO* 引入异步通信概念，采用了 *proactor* 模式，简化了程序编写，只有有效的请求才启动线程，它的特点是先由操作系统完成后才通知服务端程序启动线程去处理，一般适用于链接数较多且连接时间较长的应用。





## 三种 I/O 模型对比

|          | BIO      | NIO                    | AIO        |
| -------- | -------- | ---------------------- | ---------- |
| I/O模型  | 同步阻塞 | 同步非阻塞（多路复用） | 异步非阻塞 |
| 编程难度 | 简单     | 复杂                   | 复杂       |
| 可靠性   | 低       | 高                     | 高         |
| 吞吐量   | 低       | 高                     | 高         |

**同步阻塞：**请求方发送请求之后，需要等待响应结果才可以处理其他事情。

**同步非阻塞：**请求方发送请求之后，不需要等待响应结果就可以去处理其他事情；但是在这期间需要轮询向服务器端发请求查看是否有响应结果。

**异步非阻塞：**请求方发送请求之后，不需要等待响应结果就可以去处理其他事情；当服务器端处理完请求之后，会主动通知客户端已经处理完毕该请求，并将响应结果。（与异步的区别）





## Netty概述

> Netty 是一个异步的、基于事件驱动的网络应用框架，用以快速开发高性能、高可靠性协议的服务器端和客户端。
>
> Netty 主要针对在 TCP 协议下，面向 Clients 端的高并发应用，或者 Peer-to-Peer 的大量数据持续传输的应用。
>
> Netty 的本质是一个 NIO 框架，适用于服务器通讯相关的多种应用场景。



### NIO存在的问题

1. NIO 的类库和 API 繁杂，使用麻烦；需要熟练掌握 Selector，ServerSocketChannel，SocketChannel，ByteBuffer 等。
2. 需要具备其他的额外技能；要熟悉 Java 多线程编程，因为 NIO 涉及到 Reactor 模式。只有对多线程和网络编程非常熟悉，才能写出高质量的 NIO 程序。
3. 开发工作量和难度大；例如客户端面临断连重连，网络闪断，半包读写，失败缓存，网络拥塞和异常处理等情况。
4. JDK NIO 的 bug；例如：Epoll bug，他会导致 Selector 空轮询，最终导致 CPU 100%。直到 JDK1.7 该问题仍旧存在。



### Netty的优点

>  *Netty* 对 *JDK* 自带的 *NIO* 的 *API* 进行了封装，解决了 *NIO* 存在的一些问题。

1. 设计优雅；适用于各种传输类型的统一 *API* 阻塞和非阻塞 *Socket*；基于灵活且可扩展的事件模型，可以清晰地分离关注点；高度可定制的线程模型，单线程，一个或多个线程池。
2. 使用方便，详细记录的 *javadoc*，用户指南和实例；没有其他依赖项，可以兼容较低的 *JDK* 版本。
3. 高性能，高吞吐量，延迟低，减少资源消耗，减少不必要的内存复制。
4. 安全，完整的 *SSL/TSL* 和 *StartTLS* 支持。



### 线程模型

#### 基本介绍

> 目前存在的线程模型主要有：**传统 I/O 服务模型** 和 **Reactor 模式**。
>
> **Netty 线程模式主要基于多 Reactor 多线程模式，并做了一定的改进。**



#### 传统I/O模式

![1591153893983](C:\Users\huhan\AppData\Roaming\Typora\typora-user-images\1591153893983.png)



**模型特点**

1. 采用 *BIO* 模式获取输入的数据。
2. 每个连接都需要独立的线程完成数据的输入，业务处理和数据返回。

**问题分析**

1. 当并发数很大时，就会创建大量的线程，导致程序占用大量的系统资源。
2. 连接创建后，如果当前线程暂时没有数据可读，该线程会阻塞在 *read* 操作，造成线程资源浪费。

**解决方案**

> 采用 I/O 多路复用模型

![1591154343302](C:\Users\huhan\AppData\Roaming\Typora\typora-user-images\1591154343302.png) 

1. 基于 I/O 多路复用模型。多个连接共用一个阻塞对象，应用程序只需等待一个阻塞对象，而不必阻塞等待所有连接。当某个连接有新数据可以处理时，操作系统通知应用程序，线程从阻塞状态返回，开始进行业务处理。
2. 基于线程池复用线程资源。不必再为每个连接创建线程，只需将连接完成后的业务处理任务分配给相应的处理线程进行处理。



#### *Reactor*模式

>  参考文章：https://www.cnblogs.com/winner-0715/p/8733787.html 
>
> *Reactor* 也被称为：反应器模式，分发者模式或通知者模式



***Reactor* 模式的核心组成**

1. *Reactor*：在一个单独的线程中运行，负责监听和分发事件。将事件分发给 *Handler* 来对 I/O 事件作出反应。
2. *Handler*：处理程序执行 I/O 事件要完成的实际事件。



***Reactor* 模式的优点**

1. 响应快，不必为单个同步时间所阻塞（虽然 *Reactor* 本身是同步的）。
2. 可以最大程度的避免复杂的多线程及同步问题，并且避免了多线程/进程的切换开销。
3. 扩展性好，可以方便的通过增加 *Reactor* 实例个数来充分利用 CPU 资源。
4. 复用性好，*Reactor* 模型本身与具体事件处理逻辑无关，具有很高的复用性。



#### *Reactor*单线程

 ![img](https://upload-images.jianshu.io/upload_images/4235178-4047d3c78bb467c9.png) 

**模型说明**

1. 通过一个阻塞对象监听多路连接请求。
2. *Reactor* 通过 *select* 监听客户端请求事件，收到事件后通过 *dispatch* 进行分发。
3. 如果是建立连接请求事件，则由 *Acceptor* 通过 *accept* 处理连接请求，然后创建一个 *Handler* 对象处理连接事件；如果是其他事件，则 *Reactor* 会分发调用连接对应的 *Handler* 来响应。
4. *Handler* 会完成 `read -> 业务处理 -> send` 的完整业务流程。



**模型使用场景**

该模型适用于客户端的数量优先，业务处理非常快速的情况。比如 *Redis* 在业务处理的时间复杂度为 O(1) 的情况。



+ **优点**
  + 模型简单，没有多线程、进程通信、竞争的问题，全部都在一个线程中完成。

+ **缺点**
  + 性能问题，只有一个线程，无法完全发挥多核 CPU 的性能。*Handler* 在处理某个连接上的业务时，整个进程无法处理其他连接事件，很容易导致性能瓶颈。
  + 可靠性问题，线程意外终止，或者进入死循环，会导致整个系统通信模块不可用，不能接收和处理外部消息，造成节点故障。



#### 单Reactor多线程

 ![img](https://upload-images.jianshu.io/upload_images/4235178-d570de7505817605.png) 

**模型说明**

1. *Reactor* 对象通过 *select* 监听客户端请求事件，收到事件后，通过 *dispatch* 进行分发。
2. 如果建立连接请求，则由 *Acceptor* 通过 *accept* 处理连接请求，然后创建一个 *Handler* 对象处理完成连接后的各种事件。
3. 如果不是连接请求，则由 *Reactor* 分发调用连接对应的 *Handler* 处理。
4. *Handler* 只负责响应事件，不做具体的业务处理，通过 *read* 读取数据后，会分发给后面的 *work* 线程池的某个线程处理业务。
5. *worker* 线程池会分配独立线程完成真正的业务，并将结果返回给 *Handler*。
6. *Handler* 收到响应后，通过 *send* 将结果返回给客户端。 



+ **优点**
  + 可以充分利用多核 CPU 的处理能力。

+ **缺点**
  + 多线程数据共享和访问比较复杂，*Reactor* 单线程处理所有的事件的监听和响应，在高并发场景容易出现性能瓶颈。

#### 主从Reactor多线程

> 针对单 *Reactor* 多线程模型中，*Reactor* 在单线程中运行，在高并发场景容易出现性能瓶颈，可以采用 *Reactor* 在多线程中运行。

 ![img](https://upload-images.jianshu.io/upload_images/4235178-929a4d5e00c5e779.png) 



**模型说明**

1. *Reactor* 主线程 *MainReactor* 对象通过 *select* 监听连接事件，收到事件后，通过 *Acceptor* 处理连接事件。
2. 当 *Acceptor* 处理连接事件后，*MainReactor* 将连接分配给 *SubReactor*。
3. *SubReactor* 将连接加入到连接队列进行监听，并创建 *Handler* 进行各种事件处理。
4. 当有新时间发生时，*SubReactor* 就会调用对应的 *Handler* 处理。
5.  *Handler* 通过 *read* 读取数据，分发给后面的 *Worker* 线程处理。
6. *Worker* 线程池分配独立的 *Worker* 线程进行业务处理，并返回结果。
7. *Handler* 收到响应的结果后，再通过 *send* 结果返回给客户端。
8. *Reactor* 主线程可以对应多个 *Reactor* 子线程，即 *MainReactor* 可以关联多个 *SubReactor*



+ **优点**
  + 父线程与子线程的数据交互简单，职责明确，父线程只需要接收新连接，子线程完成后续的业务处理。
  + *MainReactor* 主线程只需要把新连接传给 *SubReactor* 子线程，子线程无需返回数据。

+ **缺点**
  + 编程复杂度较高。



## Netty线程模型

> 参考文章： https://www.jianshu.com/p/38b56531565d 



 ![img](http://ifeve.com/wp-content/uploads/2019/08/image-4-1024x741.png) 



### 模型说明

1. *Netty* 抽象出两组线程池，*BossGroup* 和 *WorkGroup*；*BossGroup* 负责接收客户端的连接，*WorkerGroup* 负责网络的读写；他们两者的类型都是 *NioEventLoopGroup*。
2. *NioEventLoopGroup* 中包含多个事件循环，每一个事件循环是 *NioEventLoop*。*NioEventLoopGroup* 中可以有多个线程，即可以有多个 *NioEventLoop*。
3. *NioEventLoop* 表示一个不断循环的执行处理任务的线程，每个 *NioEventLoop* 都有一个 *Selector*，用于监听绑定在其上的 *Socket* 的网络通讯。
4. *WorkerGroup* 中的每个 *NioEventLoop* 处理业务时，会使用 *pipeline*。*pipeline* 中包含了 *channel*，即通过 *pipeline* 可以获取到对应的管道，管道中维护了很多的处理器。

+ ***BossGroup* 的循环执行**
  1. 轮询 *accept* 事件。
  2. 处理 *accept* 事件，与 *client* 建立连接，生成 *NioSocketChannel*，并将其注册到 *WorkerGroup* 上的某个 *NioEventLoop* 的 *Selector* 中。
  3. 处理任务队列的任务，即 *runAllTasks*。
+ ***WorkGroup* 的循环执行**
  1. 轮询 *read* 和 *write* 事件。
  2. 在对应的 *NioSocketChannel* 中处理 I/*O* 事件（*read* 和 *write*）。
  3. 处理任务队列的任务，即 *runAllTasks*。

 ### NioEventLoop中的事件处理

1. ***Server* 端**

    ![img](https://upload-images.jianshu.io/upload_images/5249993-2ec7c451bd3e5ce9.png?imageMogr2/auto-orient/strip|imageView2/2/w/1200/format/webp)

2. ***Client* 端**

    ![img](https://upload-images.jianshu.io/upload_images/5249993-8c7ddead886c3b47.png?imageMogr2/auto-orient/strip|imageView2/2/w/1200/format/webp) 

### 任务队列

> 当业务处理所用的时间比较长的时候，可以将任务添加到任务队列。

1. **用户程序自定义普通任务**

   + 将任务提交到 *channel* 对应的 *NioEventLoop* 的 *taskQueue* 中。

   + 队列只用一个线程执行，队列中的任务是阻塞的。

   ~~~java
   // 添加两个任务到任务队列中
   ctx.channel().eventLoop().execute(() -> {
               try {
                   Thread.sleep(10 * 1000);
               } catch (InterruptedException e) {
                   e.printStackTrace();
               }
               System.out.println("当前线程：" + Thread.currentThread().getId());
               System.out.println("10 seconds later...");
           });
   ctx.channel().eventLoop().execute(() -> {
               try {
                   Thread.sleep(10 * 1000);
               } catch (InterruptedException e) {
                   e.printStackTrace();
               }
               System.out.println("当前线程：" + Thread.currentThread().getId());
               System.out.println("20 seconds later...");
           });
   ~~~

2. **用户自定义定时任务**

   + 将任务提交到 *channel* 对应的 *NioEventLoop* 的 *ScheduleTaskQueue* 中。

   + 队列只用一个线程执行，队列中的任务是阻塞的。

   ~~~java
   ctx.channel().eventLoop().schedule(() -> {...});
   ~~~

3. **非当前 *Reactor* 线程调用** 
   + 在创建服务端的启动对象，配置参数时设置。
   +  在设置参数的时候通过hashcode，例如在推送系统的业务线程里面，根据用户的标识，找到对应的channel引用，然后调用Write类方法向该用户推送消息，就会进入到这种场景。最终的Write会提交到任务队列中后被异步消费 。

## Netty异步模型

### 基本介绍

1. 异步与同步相对。当一个异步过程调用发出后，调用者不能立刻得到结果。实际处理这个调用的组件在完成后，通过状态、通知和回调来通知调用者。异步处理不会造成线程阻塞，线程在 *I/O* 期间可以处理其他业务，在高并发的情况下会更稳定和更高的吞吐量。
2. *Netty* 中的 *I/O* 操作是异步的，包括 *Bind*、*Write*、*Connect* 等操作会简单的返回一个 *ChannelFuture*。
3. 调用者不能立刻得到返回结果，而是通过 *Future-Listener* 机制，用户可以方便的主动获取或者通过通知机制获得 *I/O* 操作结果。
4. *Netty* 的异步模型是建立在 *future* 和 *callback* 之上的。核心思想是：在调用一个比较耗时的业务时，会立刻给用户返回一个 *Future* ，后续通过 *Future* 去监控这个业务的处理情况（即 *Future-Listener* 机制）



### Future-Listener机制

1. 当 *Future* 对象刚刚创建时，处于非完成状态，调用者可以通过返回的 *ChannelFuture* 来获取操作执行的状态，注册监听函数来执行完成后的操作。
2. 常见操作如下
   + ***isDone()*** ：判断当前操作是否完成。
   + ***isSuccess***：判断已完成的当前操作是否成功。
   + ***getCause***：获取已完成的当前操作失败的原因。
   + ***isCancelled***：判断已完成的当前操作是否被取消。
   + ***addListener***：注册监听器，若当前操作已完成，将会通知指定的监听器。

~~~java
/** 绑定端口是异步操作，当绑定操作处理完，将会调用相应的监听器处理逻辑。
 * 例如下面的 System.out.println("绑定端口成功！");
 */
ChannelFuture channelFuture = serverBootstrap.bind(6666).addListener(future -> {
                if (future.isSuccess()) {
                    System.out.println("绑定端口成功！");
                } else {
                    System.err.println("绑定端口失败...");
                }
            });
~~~



## Netty核心API

+ ***BootStrap/ServerBootStrap***：是一个 *Netty* 程序的开始，分别配置客户端和服务端的启动对象。
+ ***Future/ChannelFuture***：通过 *Future/ChannelFuture* 可以注册一个监听，用于异步操作。
+ ***Channel***：*Netty* 网络通信的组件，能够执行网络 *I/O* 操作。
  + *NioSocketChannel*：异步的客户端 *TCP Socket* 连接。
  + *NioServerSocketChannel*：异步的服务器端 *TCP Socket* 连接。
  + *NioDatagramChannel*：异步的 *UDP* 连接。
  + *NioSctpChannel*：异步的客户端 *Sctp* 连接。
  + NioSctpServerChannel：异步的服务器端 *Sctp* 连接。这些通道涵盖了 *UDP* 和 *TCP* 网络 *I/O* 以及文件 I/O。 
+ ***Selector***：*Netty* 基于 *Selector* 对象实现 *I/O* 多路复用，通过 *Selector* 一个线程可以监听多个连接的 *Channel* 事件。
+ ***ChannelHandler***：处理 *I/O* 事件或者拦截 *I/O* 操作，并将其转发到 *ChannelPipelie*（业务处理链）中的下一个处理程序。
+ ***Pipeline/ChannelPipeline***：*ChannelPipeline* 是一个 *Handler* 的集合，它负责处理和拦截 *inbound* 或者 *outbound* 事件和操作，相当于一个贯穿 *Netty* 的链。

+ ***ChannelHandlerContext***：关联一个 *ChannelHandler* 对象，同时也绑定了对应的 *Pipeline* 和 *Channel* 的信息。其常用方法如下：
  + *ChannelFuture()*：关闭通道。
  + *ChannelOutboundInvoker flush()*：刷新。
  + *ChannelFuture writeAndFlush(Object msg)*：将数据写到 *ChannelPipeline* 中。

+ ***ChannelOption***：*Netty* 在创建 *Channel* 实例后，一般都需要设置 *ChannelOption* 参数。具体参数如下：
  + *ChannelOption.SO_BACKLOG*：对应 *TCP/IP* 协议 *listen* 函数中的 *backlog* 参数，用来初始化服务器可连接队列大小（可容纳客户端等待连接的数量）。
  + *ChannelOption.SO_KEEPALIVE*：一致保持连接活动状态。

+ ***EventLoopGroup/NioEventLoopGroup***：*NioEventLoopGroup* 是 *EventLoopGroup* 的实现类。  *EventLoopGroup* 是一组 *EventLoop* 的抽象，*Netty* 为了更好的利用多核 *CPU* 资源，一般会有多个 *EventLoop* 同时工作，每个 *EventLoop* 维护一个 *Selector* 实例。

+ ***Unpooled***：是 *Netty* 提供的一个专门用来操作缓冲区（BtyeBuf）的工具类。