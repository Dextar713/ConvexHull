import json

from flask import Flask, render_template, url_for, request, jsonify
from polygon import Point, Polygon

app = Flask(__name__)
poly: Polygon = Polygon([])


@app.route('/')
def home():
    return render_template('home.html')


@app.route('/convex_hull', methods=['post'])
def convex():
    global poly
    req_data = request.get_json()
    # print(req_data)
    poly = Polygon(req_data['points'])
    conv_hull = poly.convex_hull()
    # print(len(conv_hull))
    return json.dumps([{'x': p.x, 'y': p.y} for p in conv_hull])


@app.route('/inside', methods=['post'])
def point_inside():
    if not poly.is_build():
        return jsonify({'poly': False})
    req_inside = request.get_json()
    # print(req_data)
    is_inside = poly.is_point_inside(req_inside['x'], req_inside['y'])
    return jsonify({'poly': True, 'inside': is_inside})


if __name__ == '__main__':
    app.run(debug=True)
