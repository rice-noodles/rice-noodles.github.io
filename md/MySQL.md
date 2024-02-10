> https://dev.mysql.com/doc/refman/5.7/en/if.html 

## 常用命令

### 系统命令

~~~ shell
net start mysql	# 启动服务

net stop mysql	# 关闭服务

mysql -u root -p	# 登陆

show database	# 显示所有数据库

use 'database_name'	# 设置名字为 database_name 的数据库

show tables # 显示所有表对象

desc 'table_name'	# 显示名字为 table_name 的表结构

source c:/bbsdb.sql	# 执行sql脚本命令

show variables like '%char%	# 显示系统所使用的字符集

alter database 'database_name' character set utf8;	# 修改数据库名字为database_name的默认字符集

show create database 'database_name'	# 显示对象的定义信息
~~~



### 修改表结构

~~~ shell
constraint PK_字段 primary key(字段)	# 设置主键

唯一约束：constraint UK_字段 unique key(字段)

默认约束：constrint DF_字段 default('默认值') for 字段

检查约束：constraint CK_字段 check(约束。如：len(字段)>1)

主外键关系：constraint FK_主表_从表 foreign(外键字段) references 主表(主表主键字段)
~~~



## 通配符

| **%**                              | **替代 0 个或多个字符**        |
| ---------------------------------- | ------------------------------ |
| **_**                              | **替代一个字符**               |
| **[*charlist*]**                   | **字符列中的任何单一字符**     |
| **[^*charlist*] 或 [!*charlist*]** | **不在字符列中的任何单一字符** |

## 更新语句

~~~sql
# (INSERT) 插入
INSERT INTO table_name (column1,column2,column3,...) VALUES (value1,value2,value3,...);

# (UPDATE) 更新
UPDATE table_name SET column1=value1,column2=value2,... WHERE some_column=some_value;

# (DELETE) 删除
DELETE FROM table_name WHERE some_column=some_value;
~~~

## CASE（选择分支）

~~~sql
update salary set 
sex = case sex
    when 'm' then 'f'
    when 'f' then 'm'
end
~~~

## 窗口函数

> https://leetcode-cn.com/problems/rank-scores/solution/tu-jie-sqlmian-shi-ti-jing-dian-pai-ming-wen-ti-by/ 

 ![1.png](https://pic.leetcode-cn.com/555db2ac6d57cc9c591c6475de79262f7ba4ecd43142ff0750e09d4d18fdffa6-1.png) 

### 排名

1. **rank** 函数：这个例子中是5位，5位，5位，8位，也就是如果有并列名次的行，会占用下一名次的位置。比如正常排名是1，2，3，4，但是现在前3名是并列的名次，结果是：1，1，1，4。

2. **dense_rank** 函数：这个例子中是5位，5位，5位，6位，也就是如果有并列名次的行，不占用下一名次的位置。比如正常排名是1，2，3，4，但是现在前3名是并列的名次，结果是：1，1，1，2。

3. **row_number** 函数：这个例子中是5位，6位，7位，8位，也就是不考虑并列名次的情况。比如前3名是并列的名次，排名是正常的1，2，3，4。

作者：houzidata
链接：https://leetcode-cn.com/problems/rank-scores/solution/tu-jie-sqlmian-shi-ti-jing-dian-pai-ming-wen-ti-by/
来源：力扣（LeetCode）
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。

## 查询

### 基础查询

~~~sql
# (SELECT) 查询
SELECT column_name,column_name FROM table_name;	

# (DISTINCT) 去重
SELECT DISTINCT column_name,column_name FROM table_name;	

# (ORDER BY...ASC|DESC) 查询并排序( 默认是 ASC )
SELECT column_name,column_name FROM table_name ORDER BY column_name,column_name ASC|DESC;

# (LIMIT) 控制返回记录数
SELECT column_name(s) FROM table_name LIMIT number;	
# 使用 LILMIT 返回第 n 行数据
SELECT column_name(s) FROM table_name LIMIT number-1, 1;	

# (LIKE) 模糊查询
SELECT column_name(s) FROM table_name WHERE column_name LIKE pattern;

# (IN) 返回指定条件的数据
SELECT column_name(s) FROM table_name WHERE column_name IN (value1,value2,...);

# (BETWEEN...AND) 选取介于两个值之间的数据范围内的值。这些值可以是数值、文本或者日期
SELECT column_name(s) FROM table_name WHERE column_name BETWEEN value1 AND value2;

# (UNION) 用于合并两个或多个 SELECT 语句的结果集(不包含重复值)，UNION 结果集中的列名总是等于 UNION 中第一个 SELECT 语句中的列名。
SELECT column_name(s) FROM table1
UNION
SELECT column_name(s) FROM table2;

# (UNION ALL) 用于合并两个或多个 SELECT 语句的结果集(包含重复值)
SELECT country FROM Websites
UNION ALL
SELECT country FROM apps
ORDER BY country;                                   
~~~

### 子查询

+ 子查询就是将一个查询（子查询）的结果作为另一个查询（主查询）的数据来源或判断条件的查询。
+ 常见的子查询有 *WHERE* 子查询，*HAVING* 子查询，*FROM* 子查询，*SELECT* 子查询，*EXISTS* 子查询。
+ 子查询要使用小括号（）。

#### WHERE子查询

>  在 *WHERE* 子句中进行使用查询 。

~~~sql
SELECT *
FROM table1
WHERE column_name<(SELECT AVG(column_name) FROM table2);
~~~

#### HAVING子查询

> *HAVING* 子句是对分组统计函数进行过滤的子句，也可以在 *HAVING* 子句中使用子查询

```sql
SELECT conlumn_1, AVG(conlumn_2)
FROM table_name
GROUP BY conlumn_1
HAVING AVG(conlumn_2)=(SELECT MAX(AVG(conlumn_2)) FROM table_name GROUP BY conlumn_1);
```

#### FROM子查询

> 将一个查询结构（一般多行多列）作为主查询的数据源。

```sql
SELECT conlumn_1, AVG(conlumn_2)
FROM (SELECT conlumn_1,AVG(conlumn_2) AS other_name FROM table_name GROUP BY conlumn_1) 
/* temp 作为子查询结果的字段 */
temp
WHERE temp.other_name>2000;
```

#### SELECT子查询

> 查询在 *SELECT* 子句中使用查询的结果。

~~~sql
SELECT table1.*,
/* another_field 作为子查询结果的字段 */
(SELECT table2.another_field FROM table2 WHERE table1.id=table2.id) another_field  
FROM table1 limit 10;
~~~



#### EXISTS子查询

>  用于判断查询子句是否有记录，如果有一条或多条记录存在返回 *True*，否则返回 *False*。 

~~~sql
SELECT column_name(s)
FROM table_name
WHERE EXISTS
(SELECT column_name FROM table_name WHERE condition);
~~~



### 连接查询

![img](https://www.runoob.com/wp-content/uploads/2019/01/sql-join.png)

#### INNER JOIN

 ![SQL INNER JOIN](https://www.runoob.com/wp-content/uploads/2013/09/img_innerjoin.gif) 

~~~sql
SELECT column_name(s)
FROM table1
INNER JOIN table2
ON table1.column_name=table2.column_name;
~~~

>  INNER JOIN 关键字在表中存在至少一个匹配时返回行。如果 table1 表中的行在 table2  中没有匹配，则不会列出这些行。 

####  LEFT JOIN 

 ![SQL LEFT JOIN](https://www.runoob.com/wp-content/uploads/2013/09/img_leftjoin.gif) 

~~~ sql
SELECT column_name(s)
FROM table1
LEFT JOIN table2
ON table1.column_name=table2.column_name;
~~~

> LEFT JOIN 关键字从左表（table1）返回所有的行，即使右表（table2）中没有匹配。 

#### RIGHT JOIN

 ![SQL RIGHT JOIN](https://www.runoob.com/wp-content/uploads/2013/09/img_rightjoin.gif) 

~~~sql
SELECT column_name(s)
FROM table1
RIGHT JOIN table2
ON table1.column_name=table2.column_name;
~~~

>  RIGHT JOIN 关键字从右表（table1）返回所有的行，即使左表（table2）中没有匹配。 

#### FULL JOIN

 ![SQL FULL OUTER JOIN](https://www.runoob.com/wp-content/uploads/2013/09/img_fulljoin.gif) 

~~~sql
SELECT column_name(s)
FROM table1
FULL OUTER JOIN table2
ON table1.column_name=table2.column_name;
~~~

>  FULL OUTER JOIN 关键字返回左表（table1）和右表（table2）中所有的行。如果 "table1" 表中的行在 "table2" 中没有匹配或者 "table2" 表中的行在 "table1" 表中没有匹配，也会列出这些行。   

### 聚合函数

#### AVG()

> AVG() 函数返回数值列的平均值。

~~~sql
SELECT AVG(column_name) FROM table_name
~~~

#### COUNT()

>  COUNT() 函数返回匹配指定条件的行数。 

~~~sql
SELECT COUNT(column_name) FROM table_name;
~~~

####  FIRST()  

>  FIRST() 函数返回指定的列中第一个记录的值。 

~~~sql
SELECT FIRST(column_name) FROM table_name;
~~~

####  LAST() 

>  LAST() 函数返回指定的列中最后一个记录的值。 

~~~sql
SELECT LAST(column_name) FROM table_name;
~~~

####  MAX() 

>  MAX() 函数返回指定列的最大值。 

~~~sql
SELECT MAX(column_name) FROM table_name;
~~~

####  MIN()  

>  MIN() 函数返回指定列的最小值。 

~~~sql
SELECT MIN(column_name) FROM table_name;
~~~

####  SUM()  

>  SUM() 函数返回数值列的总数。 

~~~sql
SELECT SUM(column_name) FROM table_name;
~~~

#### GROUP BY

>  GROUP BY 语句常用于结合聚合函数，根据一个或多个列对结果集进行分组。 

**需要合并哪一个字段就 group by 哪一个字段**

~~~sql
SELECT column_name, aggregate_function(column_name)
FROM table_name
WHERE column_name operator value
GROUP BY column_name;
~~~



## explain

>  *explain* 显示了 *MySQL* 如何使用索引来处理 *select* 语句以及连接表。可以帮助选择更好的索引和写出更优化的查询语句。 
>
>  参考： https://www.cnblogs.com/fzxey/p/10896244.html 

### 使用方法

在 *SQL* 语句前加入 *explain* 即可。

### 字段说明

#### id

> 是 *SQL* 执行的顺序的标识，*SQL* 从大到小的执行。

1. *id* 相同时，执行顺序由上至下。

2. 如果是子查询，*id* 的序号会递增，*id* 值越大优先级越高，越先被执行。


#### select_type

> 表示查询中每个 *select* 子句的类型。
>
> 主要有：*SIMPLE，PRIMARY，UNION，DEPENDENT UNION，UNION RESULT，SUBQUERY，DEPENDENT SUBQUERY，DERIVED，UNCACHEABLE SUBQUERY*

1. **SIMPLE：**简单查询，不包含 *UNION* 或子查询等。
2. **PRIMARY：**查询中若包含任何复杂的子部分，最外层的 *select* 被标记为 *PRIMARY*。
3. **UNION：** *UNION* 中的第二个或后面的 *SELECT* 语句。
4.  **DEPENDENT UNION：** *UNION* 中的第二个或后面的 *SELECT* 语句，取决于外面的查询。
5. **UNION RESULT：** *UNION* 的结果。
6. **SUBQUERY：**子查询中的第一个 *SELECT*。
7. **DEPENDENT SUBQUERY：**子查询中的第一个 *SELECT*，取决于外面的查询。
8.  **DERIVED：**派生表的 *SELECT*， *FROM* 子句的子查询。
9. **UNCACHEABLE SUBQUERY：**一个子查询的结果不能被缓存，必须重新评估外链接的第一行。

#### table

>  显示数据所属的表。

#### type

> 表示 *MySQL* 在表中找到所需行的方式，又称“访问类型”。
>
> 常用的类型有（从左到右，性能从差到好）： *ALL, index, range, ref, eq_ref, const, system, NULL*。
>
> 主要说明查询中使用到的索引类型，如果没有用到索引则为 *all*。

**ALL：** *Full Table Scan*。遍历全表以找到匹配的行。

**index：** *Full Index Scan*。只遍历索引树。

**range：**只检索给定范围的行，使用一个索引来选择行。

**ref：**表示上述表的连接匹配条件，即哪些列或常量被用于查找索引列上的值。

**eq_ref：**类似 *ref*，区别就在使用的索引是唯一索引，对于每个索引键值，表中只有一条记录匹配，简单来说，就是多表连接中使用 *primary key* 或者 *unique key* 作为关联条件。

**const、system：**当 *MySQL* 对查询某部分进行优化，并转换为一个常量时，使用这些类型访问。如将主键置于*where* 列表中，*MySQL* 就能将该查询转换为一个常量 *system* 是 *const* 类型的特例，当查询的表只有一行的情况下，使用 *system*。

**NULL：** *MySQL* 在优化过程中分解语句，执行时甚至不用访问表或索引，例如从一个索引列里选取最小值可以通过单独索引查找完成。

#### possible_keys

> 指出 *MySQL* 能使用哪个索引在表中找到记录，查询涉及到的字段上若存在索引，则该索引将被列出，但不一定被查询使用。

如果该列是 *NULL*，则没有相关的索引。在这种情况下，可以通过检查 *WHERE* 子句看是否它引用某些列或适合索引的列来提高你的查询性能。如果是这样，创造一个适当的索引并且再次用 *EXPLAIN* 检查查询。

#### Key

> 显示 *MySQL* 实际决定使用的键（索引）

如果没有选择索引，键是 *NULL*。

要想强制 *MySQL* 使用或忽视 *possible_keys* 列中的索引，在查询中使用 *FORCE INDEX*、*USE INDEX* 或者 *IGNORE INDEX*。

#### key_len

> 表示索引中使用的字节数，可通过该列计算查询中使用的索引的长度（key_len 显示的值为索引字段的最大可能长度，并非实际使用长度，即 key_len 是根据表定义计算而得，不是通过表内检索出的。

不损失精确性的情况下，长度越短越好。

#### ref

> 表示上述表的连接匹配条件，即哪些列或常量被用于查找索引列上的值。

#### rows

> 表示 *MySQL* 根据表统计信息及索引选用情况，估算的找到所需的记录所需要读取的行数。

#### Extra

> 包含 *MySQL* 解决查询的详细信息。

**Using where：**列数据是从仅仅使用了索引中的信息而没有读取实际的行动的表返回的，这发生在对表的全部的请求列都是同一个索引的部分的时候，表示 *MySQL* 服务器将在存储引擎检索行后再进行过滤。

**Using temporary：**表示 *MySQL* 需要使用临时表来存储结果集，常见于排序和分组查询。

**Using filesort：** *MySQL* 中无法利用索引完成的排序操作称为“文件排序”。

> (如果出现以上的两种的红色的 Using temporary 和 Using filesort 说明效率低)

**Using join buffer：**强调了在获取连接条件时没有使用索引，并且需要连接缓冲区来存储中间结果。如果出现了这个值，那应该注意，根据查询的具体情况可能需要添加索引来改进能。

**Impossible where：**这个值强调了 where 语句会导致没有符合条件的行。

**Select tables optimized away：**这个值意味着仅通过使用索引，优化器可能仅从聚合函数结果中返回一行

> (复合索引在使用时，尽量的考虑查询时，常用的排序方向和字段组合顺序)



## 索引

> 索引是排好序的快速查找数据的数据结构。

### 优点

- 索引大大减小了数据库需要扫描的数据量，提高了数据检索效率，降低数据库的 *IO* 成本。


### 缺点

+ 实际上索引也是一个数据表，该表保存了主键与索引字段，并指向实体表的记录，因此索引也会占用空间。

+ 虽然索引大大提高了查询速度，同时却会降低更新表的速度，如对表进行 *INSERT*、*UPDATE* 和 *DELETE*。因为更新表时，*MySQL* 不仅要保存数据，还要保存索引文件。

  

### 应用场景

> 索引只是提高效率的一个因素，如果你的 *MySQL* 有大数据量的表，就需要花时间研究建立最优秀的索引，或优化查询语句。因此应该只为最经常查询和最经常排序的数据列建立索引。

*MySQL* 里同一个数据表里的索引总数限制为16个。

#### 建议使用索引

+ 主键自动建立唯一索引。
+ 频繁作为查询条件的字段应该创建索引。
+ 查询中与其他表关联的字段，外键关系建立索引。
+ 查询中用于排序的字段，排序字段若通过索引去访问将大大提高排序速度。
+ 查询中统计或者分组字段。

#### 不建议使用索引

+ 对于非常小的表，大部分情况下简单的全表扫描更高效。
+ 经常增删改的表，频繁更新的字段不适合建立索引。
+ 如果某个数据列包含许多重复的内容，为它建立索引就没有太大的实际效果。

### 索引类型