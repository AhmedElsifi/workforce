import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

/// Responsive shell shared by every role: a [BottomNavigationBar] on phones
/// (the default target), switching to a [NavigationRail] at >= 700 logical
/// pixels — the same conceptual breakpoint the web client uses to switch
/// between its sidebar and its mobile bottom nav.
class RoleShell extends StatelessWidget {
  const RoleShell({
    super.key,
    required this.navigationShell,
    required this.items,
    required this.title,
  });

  final StatefulNavigationShell navigationShell;
  final List<RoleNavItem> items;
  final String title;

  static const _wideBreakpoint = 700.0;

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (context, constraints) {
        final isWide = constraints.maxWidth >= _wideBreakpoint;

        if (isWide) {
          return Scaffold(
            appBar: AppBar(title: Text(title)),
            body: Row(
              children: [
                NavigationRail(
                  selectedIndex: navigationShell.currentIndex,
                  onDestinationSelected: (index) => _onTap(index),
                  labelType: NavigationRailLabelType.all,
                  destinations: items
                      .map((item) => NavigationRailDestination(
                            icon: Icon(item.icon),
                            selectedIcon: Icon(item.activeIcon),
                            label: Text(item.label),
                          ))
                      .toList(),
                ),
                const VerticalDivider(width: 1),
                Expanded(child: navigationShell),
              ],
            ),
          );
        }

        return Scaffold(
          appBar: AppBar(title: Text(title)),
          body: navigationShell,
          bottomNavigationBar: BottomNavigationBar(
            currentIndex: navigationShell.currentIndex,
            onTap: _onTap,
            items: items
                .map((item) => BottomNavigationBarItem(
                      icon: Icon(item.icon),
                      activeIcon: Icon(item.activeIcon),
                      label: item.label,
                    ))
                .toList(),
          ),
        );
      },
    );
  }

  void _onTap(int index) {
    navigationShell.goBranch(
      index,
      initialLocation: index == navigationShell.currentIndex,
    );
  }
}

class RoleNavItem {
  const RoleNavItem({required this.icon, required this.activeIcon, required this.label});

  final IconData icon;
  final IconData activeIcon;
  final String label;
}
