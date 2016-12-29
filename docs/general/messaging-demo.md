# Messaging Demo

* Create a local apache server (you can follow this guide for ubuntu: https://www.digitalocean.com/community/tutorials/how-to-install-linux-apache-mysql-php-lamp-stack-on-ubuntu-16-04 )

* Clone the nova-x repo ( https://github.com/liveops/nova-x ) into the /var/www/html folder.

* Edit the credentials and config objects in se/lb/messaging.php ( https://github.com/liveops/nova-x/blob/master/se/lb/messaging.php#L37 ) to use your tenant and a user on that tenant with the appropriate permissions.

* Load http://localhost/nova-x/se/lb/ in the browser and begin messaging by clicking "Chat" in the top right.
