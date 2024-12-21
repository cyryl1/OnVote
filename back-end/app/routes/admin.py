from app.routes import bp

@bp.route('/admin')
def admin():
    return '<h2>This is for admin page<h2>'

# @bp.route('/election', methods=['POST'])
# def election():
#     data = request.get_json()
#     title = data.get('title')
#     start_time = datetime.fromisoformat(data.get('start_time'))
#     end_time = datetime.fromisoformat(data.get('end_time'))

#     # reg = AuthService.register_user(name, email, password)
#     elec = Election.query.filter_by(title=title).first()
#     if elec:
#         return jsonify({"message": "Election already exist"}), 400
    
#     elec = Election(title=title, start_time=start_time, end_time=end_time)
#     return jsonify({
#         "message": "User registered",
#         "id": elec.id
#         }), 200