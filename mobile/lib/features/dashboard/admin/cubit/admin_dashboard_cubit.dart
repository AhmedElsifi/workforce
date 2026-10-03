import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:workforce_mobile/core/network/api_exception.dart';
import 'package:workforce_mobile/core/utils/resource.dart';

import '../data/admin_dashboard_repository.dart';
import '../data/admin_dashboard_stats.dart';

class AdminDashboardCubit extends Cubit<Resource<AdminDashboardStats>> {
  AdminDashboardCubit(this._repository) : super(const Resource.initial());

  final AdminDashboardRepository _repository;

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
