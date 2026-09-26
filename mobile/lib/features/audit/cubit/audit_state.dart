import 'package:equatable/equatable.dart';
import 'package:workforce_mobile/core/utils/resource.dart';

import '../data/audit_log_entry.dart';

class AuditState extends Equatable {
  const AuditState({
    this.page = const Resource.initial(),
    this.currentPage = 1,
    this.category,
  });

  final Resource<AuditPage> page;
  final int currentPage;
  final String? category;

  AuditState copyWith({
    Resource<AuditPage>? page,
    int? currentPage,
    String? category,
    bool clearCategory = false,
  }) {
    return AuditState(
      page: page ?? this.page,
      currentPage: currentPage ?? this.currentPage,
      category: clearCategory ? null : (category ?? this.category),
    );
  }

  @override
  List<Object?> get props => [page, currentPage, category];
}
