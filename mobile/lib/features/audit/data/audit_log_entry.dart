import 'package:equatable/equatable.dart';

/// One item of `GET /audit` / `GET /audit/recent` (audit.controller.js).
class AuditLogEntry extends Equatable {
  const AuditLogEntry({
    required this.description,
    required this.category,
    required this.createdAt,
    this.performedByName,
  });

  factory AuditLogEntry.fromJson(Map<String, dynamic> json) {
    String? performedByName;
    final performedBy = json['performedBy'];
    if (performedBy is Map<String, dynamic>) {
      final fname = performedBy['fname'] as String? ?? '';
      final lname = performedBy['lname'] as String? ?? '';
      performedByName = '$fname $lname'.trim();
    }

    return AuditLogEntry(
      description: json['description'] as String? ?? '',
      category: json['category'] as String? ?? 'system',
      createdAt: DateTime.parse(json['createdAt'] as String),
      performedByName: performedByName,
    );
  }

  final String description;
  final String category;
  final DateTime createdAt;
  final String? performedByName;

  @override
  List<Object?> get props => [description, category, createdAt, performedByName];
}

class AuditPage extends Equatable {
  const AuditPage({required this.logs, required this.page, required this.pages});

  factory AuditPage.fromJson(Map<String, dynamic> json) {
    final logs = json['logs'] as List<dynamic>? ?? const [];
    final pagination = json['pagination'] as Map<String, dynamic>? ?? const {};
    return AuditPage(
      logs: logs.map((e) => AuditLogEntry.fromJson(e as Map<String, dynamic>)).toList(),
      page: (pagination['page'] as num?)?.toInt() ?? 1,
      pages: (pagination['pages'] as num?)?.toInt() ?? 1,
    );
  }

  final List<AuditLogEntry> logs;
  final int page;
  final int pages;

  @override
  List<Object?> get props => [logs, page, pages];
}
