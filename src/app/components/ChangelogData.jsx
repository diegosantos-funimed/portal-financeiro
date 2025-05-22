const groupByVersion = (items) => {
    return items.reduce((acc, item) => {
        const key = `${item.version}__${item.versionDate}`;
        if (!acc[key]) {
            acc[key] = {
                version: item.version,
                versionDate: item.versionDate,
                changes: []
            };
        }
        acc[key].changes.push(item);
        return acc;
    }, {});
};

const ChangeLogData = ({ data }) => {

    const groupedData = groupByVersion(data);
    const groups = Object.values(groupedData);


    return (
        <div style={{ padding: 20 }}>
            <h1 className="text-2xl font-bold">Changelog do Portal De Notas</h1>
            {groups.map((group) => (
                <div key={group.version} style={{ marginBottom: 40 }}>
                    <h2 className="text-2 font-serif italic">
                        {group.version} -{" "}
                        {new Date(group.versionDate).toLocaleDateString('pt-BR')}
                    </h2>
                    <ul>
                        {group.changes.map((item, index) => (
                            <li key={index}>
                                <strong className={item.type === "alteração"
                                    ? "text-orange-400"
                                    : item.type === "bugfix"
                                        ? "text-amber-700"
                                        : item.type === "novo" ?
                                            "text-green-600" :
                                                item.type === "removido" ?
                                                    "text-red-600"
                                                    : "text-red-300"}>
                                    [{item.type.toUpperCase()}]</strong> - {item.description}
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
}

export default ChangeLogData;