import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:workforce_mobile/core/network/api_exception.dart';
import 'package:workforce_mobile/core/utils/resource.dart';

import '../data/audit_repository.dart';
import 'audit_state.dart';

class AuditCubit extends Cubit<AuditState> {
  AuditCubit(this._repository) : super(const AuditState());

  final AuditRepository _repository;

  Future<void> load() async {
    emit(state.copyWith(page: Resource.loading(state.page.data)));
    try {
      final result = await _repository.fetch(page: state.currentPage, category: state.category);
      emit(state.copyWith(page: Resource.success(result)));
    } on ApiException catch (error) {
      emit(state.copyWith(page: Resource.failure(error.message, state.page.data)));
    }
  }

  Future<void> setCategory(String? category) async {
    emit(state.copyWith(category: category, clearCategory: category == null, currentPage: 1));
    await load();
  }

  Future<void> goToPage(int page) async {
    emit(state.copyWith(currentPage: page));
    await load();
  }
}
