import 'package:equatable/equatable.dart';

/// Shape returned by `GET /attendance/history` and the check-in/out
/// responses (attendance.controller.js): id, workDate ("YYYY-MM-DD" in
/// Africa/Cairo time), checkIn/checkOut ISO datetimes or null.
class AttendanceRecord extends Equatable {
  const AttendanceRecord({
    required this.id,
    required this.workDate,
    this.checkIn,
    this.checkOut,
  });

  factory AttendanceRecord.fromJson(Map<String, dynamic> json) {
    return AttendanceRecord(
      id: (json['id'] ?? json['_id']).toString(),
      workDate: json['workDate'] as String,
      checkIn: json['checkIn'] == null ? null : DateTime.parse(json['checkIn'] as String),
      checkOut: json['checkOut'] == null ? null : DateTime.parse(json['checkOut'] as String),
    );
  }

  final String id;
  final String workDate;
  final DateTime? checkIn;
  final DateTime? checkOut;

  bool get isComplete => checkIn != null && checkOut != null;
  bool get isOpen => checkIn != null && checkOut == null;

  @override
  List<Object?> get props => [id, workDate, checkIn, checkOut];
}
