> https://dev.mysql.com/doc/refman/5.7/en/if.html 

## ��������

### ϵͳ����

~~~ shell
net start mysql	# ��������

net stop mysql	# �رշ���

mysql -u root -p	# ��½

show database	# ��ʾ�������ݿ�

use 'database_name'	# ��������Ϊ database_name �����ݿ�

show tables # ��ʾ���б����

desc 'table_name'	# ��ʾ����Ϊ table_name �ı�ṹ

source c:/bbsdb.sql	# ִ��sql�ű�����

show variables like '%char%	# ��ʾϵͳ��ʹ�õ��ַ���

alter database 'database_name' character set utf8;	# �޸����ݿ�����Ϊdatabase_name��Ĭ���ַ���

show create database 'database_name'	# ��ʾ����Ķ�����Ϣ
~~~



### �޸ı�ṹ

~~~ shell
constraint PK_�ֶ� primary key(�ֶ�)	# ��������

ΨһԼ����constraint UK_�ֶ� unique key(�ֶ�)

Ĭ��Լ����constrint DF_�ֶ� default('Ĭ��ֵ') for �ֶ�

���Լ����constraint CK_�ֶ� check(Լ�����磺len(�ֶ�)>1)

�������ϵ��constraint FK_����_�ӱ� foreign(����ֶ�) references ����(���������ֶ�)
~~~



## ͨ���

| **%**                              | **��� 0 �������ַ�**        |
| ---------------------------------- | ------------------------------ |
| **_**                              | **���һ���ַ�**               |
| **[*charlist*]**                   | **�ַ����е��κε�һ�ַ�**     |
| **[^*charlist*] �� [!*charlist*]** | **�����ַ����е��κε�һ�ַ�** |

## �������

~~~sql
# (INSERT) ����
INSERT INTO table_name (column1,column2,column3,...) VALUES (value1,value2,value3,...);

# (UPDATE) ����
UPDATE table_name SET column1=value1,column2=value2,... WHERE some_column=some_value;

# (DELETE) ɾ��
DELETE FROM table_name WHERE some_column=some_value;
~~~

## CASE��ѡ���֧��

~~~sql
update salary set 
sex = case sex
    when 'm' then 'f'
    when 'f' then 'm'
end
~~~

## ���ں���

> https://leetcode-cn.com/problems/rank-scores/solution/tu-jie-sqlmian-shi-ti-jing-dian-pai-ming-wen-ti-by/ 

 ![1.png](https://pic.leetcode-cn.com/555db2ac6d57cc9c591c6475de79262f7ba4ecd43142ff0750e09d4d18fdffa6-1.png) 

### ����

1. **rank** �����������������5λ��5λ��5λ��8λ��Ҳ��������в������ε��У���ռ����һ���ε�λ�á���������������1��2��3��4����������ǰ3���ǲ��е����Σ�����ǣ�1��1��1��4��

2. **dense_rank** �����������������5λ��5λ��5λ��6λ��Ҳ��������в������ε��У���ռ����һ���ε�λ�á���������������1��2��3��4����������ǰ3���ǲ��е����Σ�����ǣ�1��1��1��2��

3. **row_number** �����������������5λ��6λ��7λ��8λ��Ҳ���ǲ����ǲ������ε����������ǰ3���ǲ��е����Σ�������������1��2��3��4��

���ߣ�houzidata
���ӣ�https://leetcode-cn.com/problems/rank-scores/solution/tu-jie-sqlmian-shi-ti-jing-dian-pai-ming-wen-ti-by/
��Դ�����ۣ�LeetCode��
����Ȩ���������С���ҵת������ϵ���߻����Ȩ������ҵת����ע��������

## ��ѯ

### ������ѯ

~~~sql
# (SELECT) ��ѯ
SELECT column_name,column_name FROM table_name;	

# (DISTINCT) ȥ��
SELECT DISTINCT column_name,column_name FROM table_name;	

# (ORDER BY...ASC|DESC) ��ѯ������( Ĭ���� ASC )
SELECT column_name,column_name FROM table_name ORDER BY column_name,column_name ASC|DESC;

# (LIMIT) ���Ʒ��ؼ�¼��
SELECT column_name(s) FROM table_name LIMIT number;	
# ʹ�� LILMIT ���ص� n ������
SELECT column_name(s) FROM table_name LIMIT number-1, 1;	

# (LIKE) ģ����ѯ
SELECT column_name(s) FROM table_name WHERE column_name LIKE pattern;

# (IN) ����ָ������������
SELECT column_name(s) FROM table_name WHERE column_name IN (value1,value2,...);

# (BETWEEN...AND) ѡȡ��������ֵ֮������ݷ�Χ�ڵ�ֵ����Щֵ��������ֵ���ı���������
SELECT column_name(s) FROM table_name WHERE column_name BETWEEN value1 AND value2;

# (UNION) ���ںϲ��������� SELECT ���Ľ����(�������ظ�ֵ)��UNION ������е��������ǵ��� UNION �е�һ�� SELECT ����е�������
SELECT column_name(s) FROM table1
UNION
SELECT column_name(s) FROM table2;

# (UNION ALL) ���ںϲ��������� SELECT ���Ľ����(�����ظ�ֵ)
SELECT country FROM Websites
UNION ALL
SELECT country FROM apps
ORDER BY country;                                   
~~~

### �Ӳ�ѯ

+ �Ӳ�ѯ���ǽ�һ����ѯ���Ӳ�ѯ���Ľ����Ϊ��һ����ѯ������ѯ����������Դ���ж������Ĳ�ѯ��
+ �������Ӳ�ѯ�� *WHERE* �Ӳ�ѯ��*HAVING* �Ӳ�ѯ��*FROM* �Ӳ�ѯ��*SELECT* �Ӳ�ѯ��*EXISTS* �Ӳ�ѯ��
+ �Ӳ�ѯҪʹ��С���ţ�����

#### WHERE�Ӳ�ѯ

>  �� *WHERE* �Ӿ��н���ʹ�ò�ѯ ��

~~~sql
SELECT *
FROM table1
WHERE column_name<(SELECT AVG(column_name) FROM table2);
~~~

#### HAVING�Ӳ�ѯ

> *HAVING* �Ӿ��ǶԷ���ͳ�ƺ������й��˵��Ӿ䣬Ҳ������ *HAVING* �Ӿ���ʹ���Ӳ�ѯ

```sql
SELECT conlumn_1, AVG(conlumn_2)
FROM table_name
GROUP BY conlumn_1
HAVING AVG(conlumn_2)=(SELECT MAX(AVG(conlumn_2)) FROM table_name GROUP BY conlumn_1);
```

#### FROM�Ӳ�ѯ

> ��һ����ѯ�ṹ��һ����ж��У���Ϊ����ѯ������Դ��

```sql
SELECT conlumn_1, AVG(conlumn_2)
FROM (SELECT conlumn_1,AVG(conlumn_2) AS other_name FROM table_name GROUP BY conlumn_1) 
/* temp ��Ϊ�Ӳ�ѯ������ֶ� */
temp
WHERE temp.other_name>2000;
```

#### SELECT�Ӳ�ѯ

> ��ѯ�� *SELECT* �Ӿ���ʹ�ò�ѯ�Ľ����

~~~sql
SELECT table1.*,
/* another_field ��Ϊ�Ӳ�ѯ������ֶ� */
(SELECT table2.another_field FROM table2 WHERE table1.id=table2.id) another_field  
FROM table1 limit 10;
~~~



#### EXISTS�Ӳ�ѯ

>  �����жϲ�ѯ�Ӿ��Ƿ��м�¼�������һ���������¼���ڷ��� *True*�����򷵻� *False*�� 

~~~sql
SELECT column_name(s)
FROM table_name
WHERE EXISTS
(SELECT column_name FROM table_name WHERE condition);
~~~



### ���Ӳ�ѯ

![img](https://www.runoob.com/wp-content/uploads/2019/01/sql-join.png)

#### INNER JOIN

 ![SQL INNER JOIN](https://www.runoob.com/wp-content/uploads/2013/09/img_innerjoin.gif) 

~~~sql
SELECT column_name(s)
FROM table1
INNER JOIN table2
ON table1.column_name=table2.column_name;
~~~

>  INNER JOIN �ؼ����ڱ��д�������һ��ƥ��ʱ�����С���� table1 ���е����� table2  ��û��ƥ�䣬�򲻻��г���Щ�С� 

####  LEFT JOIN 

 ![SQL LEFT JOIN](https://www.runoob.com/wp-content/uploads/2013/09/img_leftjoin.gif) 

~~~ sql
SELECT column_name(s)
FROM table1
LEFT JOIN table2
ON table1.column_name=table2.column_name;
~~~

> LEFT JOIN �ؼ��ִ����table1���������е��У���ʹ�ұ�table2����û��ƥ�䡣 

#### RIGHT JOIN

 ![SQL RIGHT JOIN](https://www.runoob.com/wp-content/uploads/2013/09/img_rightjoin.gif) 

~~~sql
SELECT column_name(s)
FROM table1
RIGHT JOIN table2
ON table1.column_name=table2.column_name;
~~~

>  RIGHT JOIN �ؼ��ִ��ұ�table1���������е��У���ʹ���table2����û��ƥ�䡣 

#### FULL JOIN

 ![SQL FULL OUTER JOIN](https://www.runoob.com/wp-content/uploads/2013/09/img_fulljoin.gif) 

~~~sql
SELECT column_name(s)
FROM table1
FULL OUTER JOIN table2
ON table1.column_name=table2.column_name;
~~~

>  FULL OUTER JOIN �ؼ��ַ������table1�����ұ�table2�������е��С���� "table1" ���е����� "table2" ��û��ƥ����� "table2" ���е����� "table1" ����û��ƥ�䣬Ҳ���г���Щ�С�   

### �ۺϺ���

#### AVG()

> AVG() ����������ֵ�е�ƽ��ֵ��

~~~sql
SELECT AVG(column_name) FROM table_name
~~~

#### COUNT()

>  COUNT() ��������ƥ��ָ�������������� 

~~~sql
SELECT COUNT(column_name) FROM table_name;
~~~

####  FIRST()  

>  FIRST() ��������ָ�������е�һ����¼��ֵ�� 

~~~sql
SELECT FIRST(column_name) FROM table_name;
~~~

####  LAST() 

>  LAST() ��������ָ�����������һ����¼��ֵ�� 

~~~sql
SELECT LAST(column_name) FROM table_name;
~~~

####  MAX() 

>  MAX() ��������ָ���е����ֵ�� 

~~~sql
SELECT MAX(column_name) FROM table_name;
~~~

####  MIN()  

>  MIN() ��������ָ���е���Сֵ�� 

~~~sql
SELECT MIN(column_name) FROM table_name;
~~~

####  SUM()  

>  SUM() ����������ֵ�е������� 

~~~sql
SELECT SUM(column_name) FROM table_name;
~~~

#### GROUP BY

>  GROUP BY ��䳣���ڽ�ϾۺϺ���������һ�������жԽ�������з��顣 

**��Ҫ�ϲ���һ���ֶξ� group by ��һ���ֶ�**

~~~sql
SELECT column_name, aggregate_function(column_name)
FROM table_name
WHERE column_name operator value
GROUP BY column_name;
~~~



## explain

>  *explain* ��ʾ�� *MySQL* ���ʹ������������ *select* ����Լ����ӱ����԰���ѡ����õ�������д�����Ż��Ĳ�ѯ��䡣 
>
>  �ο��� https://www.cnblogs.com/fzxey/p/10896244.html 

### ʹ�÷���

�� *SQL* ���ǰ���� *explain* ���ɡ�

### �ֶ�˵��

#### id

> �� *SQL* ִ�е�˳��ı�ʶ��*SQL* �Ӵ�С��ִ�С�

1. *id* ��ͬʱ��ִ��˳���������¡�

2. ������Ӳ�ѯ��*id* ����Ż������*id* ֵԽ�����ȼ�Խ�ߣ�Խ�ȱ�ִ�С�


#### select_type

> ��ʾ��ѯ��ÿ�� *select* �Ӿ�����͡�
>
> ��Ҫ�У�*SIMPLE��PRIMARY��UNION��DEPENDENT UNION��UNION RESULT��SUBQUERY��DEPENDENT SUBQUERY��DERIVED��UNCACHEABLE SUBQUERY*

1. **SIMPLE��**�򵥲�ѯ�������� *UNION* ���Ӳ�ѯ�ȡ�
2. **PRIMARY��**��ѯ���������κθ��ӵ��Ӳ��֣������� *select* �����Ϊ *PRIMARY*��
3. **UNION��** *UNION* �еĵڶ��������� *SELECT* ��䡣
4.  **DEPENDENT UNION��** *UNION* �еĵڶ��������� *SELECT* ��䣬ȡ��������Ĳ�ѯ��
5. **UNION RESULT��** *UNION* �Ľ����
6. **SUBQUERY��**�Ӳ�ѯ�еĵ�һ�� *SELECT*��
7. **DEPENDENT SUBQUERY��**�Ӳ�ѯ�еĵ�һ�� *SELECT*��ȡ��������Ĳ�ѯ��
8.  **DERIVED��**������� *SELECT*�� *FROM* �Ӿ���Ӳ�ѯ��
9. **UNCACHEABLE SUBQUERY��**һ���Ӳ�ѯ�Ľ�����ܱ����棬�����������������ӵĵ�һ�С�

#### table

>  ��ʾ���������ı�

#### type

> ��ʾ *MySQL* �ڱ����ҵ������еķ�ʽ���ֳơ��������͡���
>
> ���õ������У������ң����ܴӲ�ã��� *ALL, index, range, ref, eq_ref, const, system, NULL*��
>
> ��Ҫ˵����ѯ��ʹ�õ����������ͣ����û���õ�������Ϊ *all*��

**ALL��** *Full Table Scan*������ȫ�����ҵ�ƥ����С�

**index��** *Full Index Scan*��ֻ������������

**range��**ֻ����������Χ���У�ʹ��һ��������ѡ���С�

**ref��**��ʾ�����������ƥ������������Щ�л��������ڲ����������ϵ�ֵ��

**eq_ref��**���� *ref*���������ʹ�õ�������Ψһ����������ÿ��������ֵ������ֻ��һ����¼ƥ�䣬����˵�����Ƕ��������ʹ�� *primary key* ���� *unique key* ��Ϊ����������

**const��system��**�� *MySQL* �Բ�ѯĳ���ֽ����Ż�����ת��Ϊһ������ʱ��ʹ����Щ���ͷ��ʡ��罫��������*where* �б��У�*MySQL* ���ܽ��ò�ѯת��Ϊһ������ *system* �� *const* ���͵�����������ѯ�ı�ֻ��һ�е�����£�ʹ�� *system*��

**NULL��** *MySQL* ���Ż������зֽ���䣬ִ��ʱ�������÷��ʱ�������������һ����������ѡȡ��Сֵ����ͨ����������������ɡ�

#### possible_keys

> ָ�� *MySQL* ��ʹ���ĸ������ڱ����ҵ���¼����ѯ�漰�����ֶ���������������������������г�������һ������ѯʹ�á�

��������� *NULL*����û����ص�����������������£�����ͨ����� *WHERE* �Ӿ俴�Ƿ�������ĳЩ�л��ʺ����������������Ĳ�ѯ���ܡ����������������һ���ʵ������������ٴ��� *EXPLAIN* ����ѯ��

#### Key

> ��ʾ *MySQL* ʵ�ʾ���ʹ�õļ���������

���û��ѡ������������ *NULL*��

Ҫ��ǿ�� *MySQL* ʹ�û���� *possible_keys* ���е��������ڲ�ѯ��ʹ�� *FORCE INDEX*��*USE INDEX* ���� *IGNORE INDEX*��

#### key_len

> ��ʾ������ʹ�õ��ֽ�������ͨ�����м����ѯ��ʹ�õ������ĳ��ȣ�key_len ��ʾ��ֵΪ�����ֶε������ܳ��ȣ�����ʵ��ʹ�ó��ȣ��� key_len �Ǹ��ݱ��������ã�����ͨ�����ڼ������ġ�

����ʧ��ȷ�Ե�����£�����Խ��Խ�á�

#### ref

> ��ʾ�����������ƥ������������Щ�л��������ڲ����������ϵ�ֵ��

#### rows

> ��ʾ *MySQL* ���ݱ�ͳ����Ϣ������ѡ�������������ҵ�����ļ�¼����Ҫ��ȡ��������

#### Extra

> ���� *MySQL* �����ѯ����ϸ��Ϣ��

**Using where��**�������Ǵӽ���ʹ���������е���Ϣ��û�ж�ȡʵ�ʵ��ж��ı��صģ��ⷢ���ڶԱ��ȫ���������ж���ͬһ�������Ĳ��ֵ�ʱ�򣬱�ʾ *MySQL* ���������ڴ洢��������к��ٽ��й��ˡ�

**Using temporary��**��ʾ *MySQL* ��Ҫʹ����ʱ�����洢�����������������ͷ����ѯ��

**Using filesort��** *MySQL* ���޷�����������ɵ����������Ϊ���ļ����򡱡�

> (����������ϵ����ֵĺ�ɫ�� Using temporary �� Using filesort ˵��Ч�ʵ�)

**Using join buffer��**ǿ�����ڻ�ȡ��������ʱû��ʹ��������������Ҫ���ӻ��������洢�м�����������������ֵ����Ӧ��ע�⣬���ݲ�ѯ�ľ������������Ҫ����������Ľ��ܡ�

**Impossible where��**���ֵǿ���� where ���ᵼ��û�з����������С�

**Select tables optimized away��**���ֵ��ζ�Ž�ͨ��ʹ���������Ż������ܽ��ӾۺϺ�������з���һ��

> (����������ʹ��ʱ�������Ŀ��ǲ�ѯʱ�����õ���������ֶ����˳��)



## ����

> �������ź���Ŀ��ٲ������ݵ����ݽṹ��

### �ŵ�

- ��������С�����ݿ���Ҫɨ�������������������ݼ���Ч�ʣ��������ݿ�� *IO* �ɱ���


### ȱ��

+ ʵ��������Ҳ��һ�����ݱ��ñ����������������ֶΣ���ָ��ʵ���ļ�¼���������Ҳ��ռ�ÿռ䡣

+ ��Ȼ�����������˲�ѯ�ٶȣ�ͬʱȴ�ή�͸��±���ٶȣ���Ա���� *INSERT*��*UPDATE* �� *DELETE*����Ϊ���±�ʱ��*MySQL* ����Ҫ�������ݣ���Ҫ���������ļ���

  

### Ӧ�ó���

> ����ֻ�����Ч�ʵ�һ�����أ������� *MySQL* �д��������ı�����Ҫ��ʱ���о���������������������Ż���ѯ��䡣���Ӧ��ֻΪ�����ѯ���������������н���������

*MySQL* ��ͬһ�����ݱ����������������Ϊ16����

#### ����ʹ������

+ �����Զ�����Ψһ������
+ Ƶ����Ϊ��ѯ�������ֶ�Ӧ�ô���������
+ ��ѯ����������������ֶΣ������ϵ����������
+ ��ѯ������������ֶΣ������ֶ���ͨ������ȥ���ʽ������������ٶȡ�
+ ��ѯ��ͳ�ƻ��߷����ֶΡ�

#### ������ʹ������

+ ���ڷǳ�С�ı��󲿷�����¼򵥵�ȫ��ɨ�����Ч��
+ ������ɾ�ĵı�Ƶ�����µ��ֶβ��ʺϽ���������
+ ���ĳ�������а�������ظ������ݣ�Ϊ������������û��̫���ʵ��Ч����

### ��������