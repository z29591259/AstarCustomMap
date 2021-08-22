class Point {
    Id = -1;
    X = -1;
    Y = -1;

    constructor(id, x, y) {
        this.Id = id;
        this.X = x;
        this.Y = y;
    }
}

class PointCost extends Point {
    Cost = -1;
    Path = [];

    /**
    * @var Point here
    * @var Point start
    * @var Point end
    * @var PointCost last
    */
    constructor(here, start, end, last = null) {
        super(here.Id, here.X, here.Y);
        this.Cost = PointCost.CalCost(here, start, end);
        if (last !== null) {
            this.Path = last.Path.concat();
        }
        this.Path.push(here.Id);
    }

    /**
    * Calculate cost, x, and y distance from start and end points
    * @var Point here current point
    * @var Point start start point
    * @var Point end end point
    */
    static CalCost(here, start, end) {
        return (Math.abs(here.X - start.X) + Math.abs(here.Y - start.Y) + Math.abs(here.X - end.X) + Math.abs(here.Y - end.Y));
    }
}

class AStarCustomMap {
    Points = [];
    Lines = [];
    OpenList = [];

    constructor(points, lines) {
        this.Points = points;
        this.Lines = lines;
    }

    /**
    * Find near point id
    * @var int id
    */
    FindNearPoint(id) {
        let near_id =
            this.Lines.filter(x => x.includes(id))
                .flat()
                .filter(x => x != id);
        return near_id;
    }

    /**
    * @var Point start start point
    * @var Point end end point
    */
    GetPath(start, end) {
        this.OpenList.push(new PointCost(start, start, end));
        let min_idx = 0;
        let short_path = null;
        while (this.OpenList.length > 0) {
            //Find minimum cost in openlist
            min_idx = 0;
            let next = this.OpenList.length === 1 ? this.OpenList[0] : this.OpenList.reduce((prev, curr, idx) => {
                if (prev.Cost < curr.Cost) {
                    return prev;
                } else {
                    min_idx = idx;
                    return curr;
                }
            });
            let nearPointIds = this.FindNearPoint(next.Id);
            this.OpenList.splice(min_idx, 1);

            for (let i = 0; i < nearPointIds.length; i++) {
                if (next.Path.includes(nearPointIds[i])) {
                    continue;
                }
                let point_cost = new PointCost(this.Points[nearPointIds[i]], start, end, next);
                if (nearPointIds[i] === end.Id) {
                    short_path = point_cost.Path;
                    this.OpenList.length = 0;
                    break;
                }
                this.OpenList.push(point_cost);
            }
        }
        return short_path;
    }
}