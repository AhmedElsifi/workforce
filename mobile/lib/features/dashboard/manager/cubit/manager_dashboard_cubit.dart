import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:workforce_mobile/core/network/api_exception.dart';
import 'package:workforce_mobile/core/utils/resource.dart';

import '../data/manager_dashboard_repository.dart';
import '../data/manager_dashboard_stats.dart';

class ManagerDashboardCubit extends Cubit<Resource<ManagerDashboardStats>> {
  ManagerDashboardCubit(this._repository) : super(const Resource.initial());

  final ManagerDashboardRepository _repository;

  Future<void> load() async {
    emit(Resource.loading(state.data));
    try {
      final stats = await _repository.fetch();
      emit(Resource.success(stats));
    } on ApiException catch (error) {
      emit(Resource.failure(error.message, state.data));
    }
  }
}
