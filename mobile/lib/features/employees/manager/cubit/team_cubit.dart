import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:workforce_mobile/core/network/api_exception.dart';
import 'package:workforce_mobile/core/utils/resource.dart';

import '../data/team_member.dart';
import '../data/team_repository.dart';

class TeamCubit extends Cubit<Resource<List<TeamMember>>> {
  TeamCubit(this._repository) : super(const Resource.initial());

  final TeamRepository _repository;

  Future<void> load() async {
    emit(Resource.loading(state.data));
    try {
      final team = await _repository.fetchTeam();
      emit(Resource.success(team));
    } on ApiException catch (error) {
      emit(Resource.failure(error.message, state.data));
    }
  }

  Future<String?> toggleStatus(TeamMember member) async {
    final newStatus = member.isActive ? 'inactive' : 'active';
    try {
      await _repository.updateStatus(member.id, newStatus);
      final current = state.data;
      if (current != null) {
        final updated = current
            .map((m) => m.id == member.id ? m.copyWith(employmentStatus: newStatus) : m)
            .toList();
        emit(Resource.success(updated));
      }
      return null;
    } on ApiException catch (error) {
      return error.message;
    }
  }
}
