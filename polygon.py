class Point:

    def __init__(self, x, y):
        self.x = x
        self.y = y


class Polygon:

    def __init__(self, points):
        self.points = [Point(p['x'], p['y']) for p in points]
        self.poly = []
        self.up = []
        self.down = []

    def is_build(self):
        return len(self.poly) > 0

    def orientation(self, p1: Point, p2: Point, p3: Point):
        val1 = (p2.y-p3.y) * (p2.x-p1.x)
        val2 = (p1.y-p2.y) * (p3.x-p2.x)
        val = val1 - val2
        return val
        # if val > 0:
        #     return -1  # anti clockwise
        # if val < 0:
        #     return 1   # clockwise
        # return 0  # collinear

    def convex_hull(self):
        self.points.sort(key=lambda cur_p: (cur_p.x, cur_p.y))
        poly_stack = []
        for p in self.points:
            if len(poly_stack) < 2:
                poly_stack.append(p)
            else:
                orient = self.orientation(poly_stack[-2], poly_stack[-1], p)
                if orient <= 0:
                    poly_stack.append(p)
                else:
                    poly_stack.pop()
                    while len(poly_stack) >= 2:
                        orient = self.orientation(poly_stack[-2], poly_stack[-1], p)
                        if orient > 0:
                            poly_stack.pop()
                        else:
                            break
                    poly_stack.append(p)
        self.poly = [x for x in poly_stack]
        self.down = poly_stack.copy()
        poly_stack = []
        for p in reversed(self.points):
            if len(poly_stack) < 2:
                poly_stack.append(p)
            else:
                orient = self.orientation(poly_stack[-2], poly_stack[-1], p)
                if orient < 0:
                    poly_stack.append(p)
                else:
                    poly_stack.pop()
                    while len(poly_stack) >= 2:
                        orient = self.orientation(poly_stack[-2], poly_stack[-1], p)
                        if orient >= 0:
                            poly_stack.pop()
                        else:
                            break
                    poly_stack.append(p)
        self.poly.extend(poly_stack[1:-1])
        self.up = poly_stack.copy()
        # print(self.poly)
        return self.poly

    def is_point_inside(self, x, y):
        p = Point(x, y)
        flag_inside = 1
        lo, hi = 1, len(self.down) - 1
        while lo <= hi:
            mid = (lo+hi)//2
            orient = self.orientation(self.down[0], self.down[mid], p)
            if orient == 0:
                hi = mid
                flag_inside = 0
                break
            if orient > 0:
                hi = mid - 1
            else:
                lo = mid + 1
        if hi < len(self.down) - 1:
            if flag_inside == 0:
                if self.down[hi].x <= p.x <= self.down[hi+1].x:
                    return 0
                return -1
            val = self.orientation(self.down[hi], self.down[hi + 1], p)
            if val > 0:
                return -1

        lo, hi = 1, len(self.up) - 1
        while lo <= hi:
            mid = (lo + hi) // 2
            orient = self.orientation(self.up[0], self.up[mid], p)
            if orient == 0:
                hi = mid
                flag_inside = 0
                break
            if orient > 0:
                hi = mid - 1
            else:
                lo = mid + 1
        if hi < len(self.up) - 1:
            if flag_inside == 0:
                if self.up[hi].x <= p.x <= self.up[hi+1].x:
                    return 0
                return -1
            val = self.orientation(self.up[hi], self.up[hi + 1], p)
            if val > 0:
                flag_inside = -1
            elif val < 0:
                flag_inside = 1
            else:
                flag_inside = 0
        return flag_inside
