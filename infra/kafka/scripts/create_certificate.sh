# 1. Create CA
openssl genrsa -out ../certs/kafka/ca.key 4096
openssl req -x509 -new -key ../certs/kafka/ca.key -days 3650 -out ../certs/kafka/ca.crt -subj "/CN=MyKafkaCA"

# 2. Server key + CSR
openssl genrsa -out ../certs/kafka/kafka.key 4096
openssl req -new -key ../certs/kafka/kafka.key -out ../certs/kafka/kafka.csr -subj "/CN=localhost"

# 3. Sign server cert with CA
openssl x509 -req -in ../certs/kafka/kafka.csr -CA ../certs/kafka/ca.crt -CAkey ../certs/kafka/ca.key -CAcreateserial \
  -out ../certs/kafka/kafka.crt -days 3650

# 4. Client key + CSR
openssl genrsa -out ../certs/monitorenv/monitorenv.key 4096
openssl req -new -key ../certs/monitorenv/monitorenv.key -out ../certs/monitorenv/monitorenv.csr -subj "/CN=monitorenv"

openssl x509 -req -in ../certs/monitorenv/monitorenv.csr -CA ../certs/kafka/ca.crt -CAkey ../certs/kafka/ca.key -CAcreateserial \
  -out ../certs/monitorenv/monitorenv.crt -days 3650

# 5. PKCS12 keystores
openssl pkcs12 -export -in ../certs/kafka/kafka.crt -inkey ../certs/kafka/kafka.key -out ../certs/kafka/kafka.p12 -name kafka -password pass:changeit
openssl pkcs12 -export -in ../certs/monitorenv/monitorenv.crt -inkey ../certs/monitorenv/monitorenv.key -out ../certs/monitorenv/monitorenv.p12 -name monitorenv -password pass:changeit

# 6. Truststores
keytool -import -trustcacerts -alias CARoot -file ../certs/kafka/ca.crt -keystore ../certs/kafka/kafka-truststore.jks -storepass changeit -noprompt
keytool -import -trustcacerts -alias CARoot -file ../certs/kafka/ca.crt -keystore ../certs/monitorenv/monitorenv-truststore.jks -storepass changeit -noprompt

# 7. Copy Client truststore and keystore
cp ../certs/monitorenv/monitorenv-truststore.jks ../certs/kafka/monitorenv-truststore.jks
cp ../certs/monitorenv/monitorenv.p12 ../certs/kafka/monitorenv.p12

# 8. Create keypass that contains password
touch ../certs/kafka/kafka.keypass
echo "changeit" > ../certs/kafka/kafka.keypass
