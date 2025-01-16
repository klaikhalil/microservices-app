from flask import Flask, request, jsonify
import psycopg2

app = Flask(__name__)

conn = psycopg2.connect(
    host="postgres",
    database="orders_db",
    user="postgres",
    password="password"
)

@app.route('/orders', methods=['POST'])
def create_order():
    data = request.json
    with conn.cursor() as cur:
        cur.execute("INSERT INTO orders (product_id, quantity) VALUES (%s, %s) RETURNING id", 
                    (data['product_id'], data['quantity']))
        order_id = cur.fetchone()[0]
        conn.commit()
    return jsonify({"id": order_id}), 201

@app.route('/orders', methods=['GET'])
def get_orders():
    with conn.cursor() as cur:
        cur.execute("SELECT * FROM orders")
        orders = cur.fetchall()
    return jsonify(orders)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
