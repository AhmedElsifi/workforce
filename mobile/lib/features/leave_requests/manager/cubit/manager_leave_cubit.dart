import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:workforce_mobile/core/network/api_exception.dart';
import 'package:workforce_mobile/core/utils/resource.dart';

import '../data/manager_leave_repository.dart';
import 'manager_leave_state.dart';

class ManagerLeaveCubit extends Cubit<ManagerLeaveState> {
  ManagerLeaveCubit(this._repository) : super(const ManagerLeaveState());

  final ManagerLeaveRepository _repository;

  Future<void> load() async {
    emit(state.copyWith(requests: Resource.loading(state.requests.data)));
    try {
      final requests = state.filter == ManagerLeaveFilter.pending
          ? await _repository.fetchPending()
          : await _repository.fetchAll();
      emit(state.copyWith(requests: Resource.success(requests)));
    } on ApiException catch (error) {
      emit(state.copyWith(requests: Resource.failure(error.message, state.requests.data)));
    }
  }

  Future<void> setFilter(ManagerLeaveFilter filter) async {
    if (filter == state.filter) return;
    emit(state.copyWith(filter: filter));
    await load();
  }

  Future<String?> review(String id, {required bool approve, required String note}) async {
    try {
      await _repository.updateStatus(id, approve ? 'Approved' : 'Rejected', note);
      await load();
      return null;
    } on ApiException catch (error) {
      return error.message;
    }
  }
}
